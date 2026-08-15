import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkUrl } from '@/services/urlValidation';
import { getProvider } from '@/providers/registry';
import { ProviderError, Platform, Quality } from '@/providers/types';

export const runtime = 'nodejs';

const bodySchema = z.object({
  url: z.string().min(1).max(2048),
  platform: z.enum(['tiktok']),
  format: z.enum(['mp4', 'mp3']),
  quality: z.enum(['best', '1080p', '720p', '480p', '360p']),
  watermarked: z.boolean(),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_URL', message: 'Invalid request.' }, { status: 400 });
  }

  const urlCheck = checkUrl(parsed.data.url);
  if (!urlCheck.valid || !urlCheck.normalized) {
    return NextResponse.json({ error: 'INVALID_URL', message: 'That link is not valid.' }, { status: 400 });
  }

  const provider = getProvider(parsed.data.platform as Platform);
  if (!provider) {
    return NextResponse.json({ error: 'UNSUPPORTED_PLATFORM', message: "We don't currently support this platform." }, { status: 400 });
  }

  try {
    const resolved = await provider.resolveDownload(urlCheck.normalized, {
      format: parsed.data.format,
      quality: parsed.data.quality as Quality,
      watermarked: parsed.data.watermarked,
    });
    return NextResponse.json(resolved, { status: 200 });
  } catch (err) {
    if (err instanceof ProviderError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 503 });
    }
    return NextResponse.json({ error: 'INTERNAL', message: 'Something went wrong.' }, { status: 500 });
  }
}
