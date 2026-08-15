import { MediaProvider, Platform } from './types';
import { tiktokProvider } from './tiktok';

const registry: Partial<Record<Platform, MediaProvider>> = {
  tiktok: tiktokProvider,
};

export function detectPlatform(url: string): MediaProvider | null {
  for (const provider of Object.values(registry)) {
    if (provider?.detect(url)) return provider;
  }
  return null;
}

export function getProvider(platform: Platform): MediaProvider | null {
  return registry[platform] ?? null;
}
