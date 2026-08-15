import { z } from 'zod';

const urlSchema = z.string().trim().min(1).max(2048).url();

export interface UrlCheckResult {
  valid: boolean;
  reason?: string;
  normalized?: string;
}

export function checkUrl(input: string): UrlCheckResult {
  const parsed = urlSchema.safeParse(input);
  if (!parsed.success) return { valid: false, reason: 'That does not look like a valid link.' };

  let u: URL;
  try {
    u = new URL(parsed.data);
  } catch {
    return { valid: false, reason: 'That does not look like a valid link.' };
  }

  if (u.protocol !== 'https:') return { valid: false, reason: 'Only https links are supported.' };

  return { valid: true, normalized: u.toString() };
}
