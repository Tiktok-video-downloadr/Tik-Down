import { Downloader } from '@/components/Downloader';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 flex flex-col items-center text-center gap-6">
      <h1 className="text-4xl font-bold text-white">Tik-Down</h1>
      <p className="text-mist text-lg">Paste a public TikTok link to download the video.</p>
      <div className="w-full">
        <Downloader />
      </div>
    </div>
  );
}
