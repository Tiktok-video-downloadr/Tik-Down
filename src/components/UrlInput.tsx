'use client';

export function UrlInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled && value.trim()) onSubmit();
      }}
      className="flex flex-col sm:flex-row gap-3 w-full"
    >
      <input
        type="url"
        placeholder="Paste TikTok video link"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1 rounded-xl bg-surface border border-line px-4 py-4 text-white placeholder:text-mist"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="rounded-xl bg-signal text-ink font-bold px-8 py-4 disabled:opacity-50"
      >
        Download
      </button>
    </form>
  );
}
