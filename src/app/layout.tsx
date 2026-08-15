import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tik-Down — TikTok Video Downloader',
  description: 'Paste a public TikTok link and download the video.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
