const ERROR_COPY: Record<string, string> = {
  INVALID_URL: "This doesn't appear to be a supported TikTok link.",
  UNSUPPORTED_PLATFORM: "We don't currently support this platform.",
  PRIVATE_CONTENT: "This content isn't publicly accessible.",
  RESTRICTED_CONTENT: 'This media cannot be retrieved.',
  PROVIDER_NOT_CONFIGURED: 'TikTok downloads are temporarily unavailable.',
  RATE_LIMITED: 'Please try again later.',
};

export function ErrorState({ code, onRetry }: { code: string; onRetry: () => void }) {
  return (
    <div role="alert" className="w-full rounded-2xl border border-warn/30 bg-warn/5 p-6 flex flex-col gap-3">
      <p className="text-sm text-mist">{ERROR_COPY[code] ?? 'Something went wrong.'}</p>
      <button onClick={onRetry} className="text-sm text-white underline underline-offset-4 self-start">
        Try again
      </button>
    </div>
  );
}
