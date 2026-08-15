'use client';

import { useState } from 'react';
import type { MediaAnalysisResult, Quality } from '@/providers/types';

export function ResultCard({
  result,
  onDownload,
  downloading,
}: {
  result: MediaAnalysisResult;
  onDownload: (selection: { format: 'mp4' | 'mp3'; quality: Quality; watermarked: boolean }) => void;
  downloading: boolean;
}) {
  const [format, setFormat] = useState<'mp4' | 'mp3'>(result.formats.mp4 ? 'mp4' : 'mp3');
  const [quality, setQuality] = useState<Quality>(result.qualities[0] ?? 'best');
  const [watermarked, setWatermarked] = useState(!result.watermark.withoutWatermark);

  return (
    <div className="w-full rounded-2xl border border-line bg-surface p-6 flex flex-col gap-4">
      {result.metadata.title && <p className="text-white font-medium">{result.metadata.title}</p>}

      {(result.formats.mp4 || result.formats.mp3) && (
        <div className="flex gap-2">
          {result.formats.mp4 && (
            <button onClick={() => setFormat('mp4')} className={`px-4 py-2 rounded-lg border ${format === 'mp4' ? 'border-signal text-signal' : 'border-line text-mist'}`}>
              MP4
            </button>
          )}
          {result.formats.mp3 && (
            <button onClick={() => setFormat('mp3')} className={`px-4 py-2 rounded-lg border ${format === 'mp3' ? 'border-signal text-signal' : 'border-line text-mist'}`}>
              MP3
            </button>
          )}
        </div>
      )}

      {result.qualities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {result.qualities.map((q) => (
            <button key={q} onClick={() => setQuality(q)} className={`px-3 py-1.5 rounded-lg border text-sm ${quality === q ? 'border-signal text-signal' : 'border-line text-mist'}`}>
              {q}
            </button>
          ))}
        </div>
      )}

      {result.watermark.withoutWatermark ? (
        <button onClick={() => setWatermarked(!watermarked)} className="text-sm text-mist self-start">
          {watermarked ? 'With watermark' : 'Without watermark'} (tap to switch)
        </button>
      ) : (
        <p className="text-sm text-mist">Watermark-free version unavailable for this media.</p>
      )}

      <button
        onClick={() => onDownload({ format, quality, watermarked })}
        disabled={downloading}
        className="rounded-xl bg-signal text-ink font-bold px-8 py-3 disabled:opacity-50"
      >
        {downloading ? 'Preparing…' : 'Download'}
      </button>
    </div>
  );
}
