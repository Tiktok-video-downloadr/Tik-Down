export type Platform = 'tiktok';

export interface MediaAvailability {
  video: boolean;
  audio: boolean;
}

export interface FormatAvailability {
  mp4: boolean;
  mp3: boolean;
}

export interface WatermarkAvailability {
  withWatermark: boolean;
  withoutWatermark: boolean;
}

export type Quality = 'best' | '1080p' | '720p' | '480p' | '360p';

export interface MediaMetadata {
  title?: string;
  author?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
}

export interface MediaAnalysisResult {
  platform: Platform;
  metadata: MediaMetadata;
  media: MediaAvailability;
  formats: FormatAvailability;
  watermark: WatermarkAvailability;
  qualities: Quality[];
}

export interface ResolvedDownload {
  url: string;
  expiresAt: string;
  format: 'mp4' | 'mp3';
  quality: Quality;
  watermarked: boolean;
}

export type ProviderErrorCode =
  | 'INVALID_URL'
  | 'PRIVATE_CONTENT'
  | 'RESTRICTED_CONTENT'
  | 'RATE_LIMITED'
  | 'PROVIDER_NOT_CONFIGURED'
  | 'UPSTREAM_TIMEOUT'
  | 'UPSTREAM_ERROR';

export class ProviderError extends Error {
  code: ProviderErrorCode;
  constructor(code: ProviderErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'ProviderError';
  }
}

export interface MediaProvider {
  platform: Platform;
  detect(url: string): boolean;
  validate(url: string): { valid: boolean; reason?: string };
  fetchMetadata(url: string): Promise<MediaAnalysisResult>;
  resolveDownload(
    url: string,
    selection: { format: 'mp4' | 'mp3'; quality: Quality; watermarked: boolean }
  ): Promise<ResolvedDownload>;
}
