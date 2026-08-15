// TikTok does not offer a public API for downloading arbitrary videos, so
// this does NOT scrape TikTok's internal endpoints (that would mean
// bypassing their access controls). Instead it's a client for a licensed
// third-party extraction service you configure via env vars. Until those
// are set, it correctly reports "not configured" instead of faking a result.

import {
  MediaAnalysisResult,
  MediaProvider,
  ProviderError,
  Quality,
  ResolvedDownload,
} from '../types';

const TIKTOK_URL_PATTERN = /^https:\/\/(www\.|vm\.|vt\.|m\.)?tiktok\.com\/.+/i;

function isConfigured(): boolean {
  return Boolean(process.env.TIKTOK_PROVIDER_BASE_URL && process.env.TIKTOK_PROVIDER_API_KEY);
}

async function callProvider<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const base = process.env.TIKTOK_PROVIDER_BASE_URL;
  const key = process.env.TIKTOK_PROVIDER_API_KEY;
  if (!base || !key) {
    throw new ProviderError('PROVIDER_NOT_CONFIGURED', 'TikTok provider credentials are not configured.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw new ProviderError('UPSTREAM_TIMEOUT', 'Timed out.');
    throw new ProviderError('UPSTREAM_ERROR', 'Could not reach provider.');
  } finally {
    clearTimeout(timeout);
  }

  if (res.status === 404) throw new ProviderError('RESTRICTED_CONTENT', 'Media not found.');
  if (res.status === 403) throw new ProviderError('PRIVATE_CONTENT', 'Not publicly accessible.');
  if (res.status === 429) throw new ProviderError('RATE_LIMITED', 'Rate limit reached.');
  if (!res.ok) throw new ProviderError('UPSTREAM_ERROR', `Provider returned ${res.status}.`);

  return (await res.json()) as T;
}

export const tiktokProvider: MediaProvider = {
  platform: 'tiktok',

  detect(url) {
    return TIKTOK_URL_PATTERN.test(url.trim());
  },

  validate(url) {
    if (!TIKTOK_URL_PATTERN.test(url.trim())) return { valid: false, reason: 'Not a recognized TikTok URL.' };
    return { valid: true };
  },

  async fetchMetadata(url): Promise<MediaAnalysisResult> {
    if (!isConfigured()) throw new ProviderError('PROVIDER_NOT_CONFIGURED', 'TikTok provider is not configured.');

    type VendorResponse = {
      title?: string;
      author?: string;
      thumbnailUrl?: string;
      durationSeconds?: number;
      hasVideo: boolean;
      hasAudio: boolean;
      formats: { mp4: boolean; mp3: boolean };
      watermark: { withWatermark: boolean; withoutWatermark: boolean };
      qualities: Quality[];
    };

    const data = await callProvider<VendorResponse>('/v1/metadata', { url });

    return {
      platform: 'tiktok',
      metadata: {
        title: data.title,
        author: data.author,
        thumbnailUrl: data.thumbnailUrl,
        durationSeconds: data.durationSeconds,
      },
      media: { video: data.hasVideo, audio: data.hasAudio },
      formats: data.formats,
      watermark: data.watermark,
      qualities: data.qualities,
    };
  },

  async resolveDownload(url, selection): Promise<ResolvedDownload> {
    if (!isConfigured()) throw new ProviderError('PROVIDER_NOT_CONFIGURED', 'TikTok provider is not configured.');

    type VendorResolveResponse = { url: string; expiresAt: string };
    const data = await callProvider<VendorResolveResponse>('/v1/resolve', {
      url,
      format: selection.format,
      quality: selection.quality,
      watermarked: selection.watermarked,
    });

    return { url: data.url, expiresAt: data.expiresAt, ...selection };
  },
};
