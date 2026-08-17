import { Downloader } from '@/components/Downloader';

const FEATURES = [
  {
    title: 'No sign-up',
    body: 'Paste a link and download. An account is never required for basic use.',
  },
  {
    title: 'Nothing stored',
    body: "Your video isn't saved on our servers — it's streamed straight to your device.",
  },
  {
    title: 'Honest options only',
    body: "If a quality or watermark-free version isn't really available, we don't pretend it is.",
  },
];

const STEPS = [
  ['1', 'Copy the link', 'Open TikTok, tap Share on a public video, then Copy Link.'],
  ['2', 'Paste it above', "We'll check what's actually available for that specific video."],
  ['3', 'Download', 'Pick your format and quality, then save it to your device.'],
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="glow-orb w-[420px] h-[420px] bg-signal top-[-120px] left-[-100px] animate-float" aria-hidden="true" />
      <div className="glow-orb w-[380px] h-[380px] bg-pulse top-[80px] right-[-140px] animate-float" style={{ animationDelay: '2s' }} aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-[520px] bg-grid" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-5 py-20 sm:py-28 flex flex-col items-center text-center gap-16">
        <section className="flex flex-col items-center gap-6 animate-fadeUp">
          <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-signal bg-signal/10 border border-signal/25 rounded-full px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            Free · No account needed
          </span>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-[1.05]">
            Save TikTok videos
            <br />
            <span className="bg-gradient-to-r from-signal to-pulse bg-clip-text text-transparent">
              in seconds
            </span>
          </h1>

          <p className="text-mist text-lg max-w-md">
            Paste a public TikTok link below and get the real download options for that video —
            no clutter, no fake buttons.
          </p>

          <div className="w-full max-w-xl mt-2">
            <Downloader />
          </div>
        </section>

        <section className="w-full grid sm:grid-cols-3 gap-4 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-line bg-surface/60 backdrop-blur-sm p-5 text-left hover:border-signal/40 transition-colors"
            >
              <p className="font-semibold text-white mb-1">{f.title}</p>
              <p className="text-sm text-mist leading-relaxed">{f.body}</p>
            </div>
          ))}
        </section>

        <section className="w-full flex flex-col gap-6 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-white">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {STEPS.map(([n, title, body]) => (
              <div key={n} className="rounded-2xl border border-line bg-surfaceRaised p-5">
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-signal/15 text-signal text-sm font-bold mb-3">
                  {n}
                </span>
                <p className="font-medium text-white mb-1">{title}</p>
                <p className="text-sm text-mist leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-mist/70">
          Tik-Down is not affiliated with, endorsed by, or sponsored by TikTok.
        </p>
      </div>
    </div>
  );
}
