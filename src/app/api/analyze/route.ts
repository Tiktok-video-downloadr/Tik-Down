import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkUrl } from '@/services/urlValidation';
import { detectPlatform } from '@/providers/registry';
import { ProviderError } from '@/providers/types';

export const runtime = 'nodejs';

const bodySchema = z.object({ url: z.string().min(1).max(2048) });

export async function POST(req: NextRequest) {
  const parsedBody = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsedBody.success) {
    return NextResponse.json({ error: 'INVALID_URL', message: "This doesn't appear to be a supported link." }, { status: 400 });
  }

  const urlCheck = checkUrl(parsedBody.data.url);
  if (!urlCheck.valid || !urlCheck.normalized) {
    return NextResponse.json({ error: 'INVALID_URL', message: urlCheck.reason ?? 'That link is not valid.' }, { status: 400 });
  }

  const provider = detectPlatform(urlCheck.normalized);
  if (!provider) {
    return NextResponse.json({ error: 'UNSUPPORTED_PLATFORM', message: "We don't currently support this platform." }, { status: 400 });
  }

  const validation = provider.validate(urlCheck.normalized);
  if (!validation.valid) {
    return NextResponse.json({ error: 'INVALID_URL', message: validation.reason ?? 'Invalid link.' }, { status: 400 });
  }

  try {
    const result = await provider.fetchMetadata(urlCheck.normalized);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof ProviderError) {
      const messages: Record<string, { status: number; message: string }> = {
        PRIVATE_CONTENT: { status: 403, message: "This content isn't publicly accessible." },
        RESTRICTED_CONTENT: { status: 422, message: 'This media cannot be retrieved.' },
        RATE_LIMITED: { status: 429, message: 'Please try again later.' },
        PROVIDER_NOT_CONFIGURED: { status: 503, message: 'TikTok downloads are temporarily unavailable.' },
        UPSTREAM_TIMEOUT: { status: 504, message: 'The media provider timed out. Please try again.' },
        UPSTREAM_ERROR: { status: 502, message: 'The media provider is temporarily unavailable.' },
      };
      const mapped = messages[err.code] ?? { status: 500, message: 'Something went wrong.' };
      return NextResponse.json({ error: err.code, message: mapped.message }, { status: mapped.status });
    }
    return NextResponse.json({ error: 'INTERNAL', message: 'Something went wrong.' }, { status: 500 });
  }
}
