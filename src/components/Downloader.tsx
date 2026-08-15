'use client';

import { useState } from 'react';
import { UrlInput } from './UrlInput';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { ResultCard } from './ResultCard';
import type { MediaAnalysisResult, Quality } from '@/providers/types';

type State =
  | { kind: 'empty' }
  | { kind: 'analyzing' }
  | { kind: 'success'; result: MediaAnalysisResult }
  | { kind: 'error'; code: string };

export function Downloader() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<State>({ kind: 'empty' });
  const [downloading, setDownloading] = useState(false);

  async function analyze() {
    setState({ kind: 'analyzing' });
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ kind: 'error', code: data.error ?? 'INTERNAL' });
        return;
      }
      setState({ kind: 'success', result: data });
    } catch {
      setState({ kind: 'error', code: 'UPSTREAM_ERROR' });
    }
  }

  async function handleDownload(selection: { format: 'mp4' | 'mp3'; quality: Quality; watermarked: boolean }) {
    if (state.kind !== 'success') return;
    setDownloading(true);
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, platform: state.result.platform, ...selection }),
      });
      const data = await res.json();
      if (res.ok) window.location.href = data.url;
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <UrlInput value={url} onChange={setUrl} onSubmit={analyze} disabled={state.kind === 'analyzing'} />
      {state.kind === 'analyzing' && <LoadingState />}
      {state.kind === 'error' && <ErrorState code={state.code} onRetry={() => setState({ kind: 'empty' })} />}
      {state.kind === 'success' && (
        <ResultCard result={state.result} onDownload={handleDownload} downloading={downloading} />
      )}
    </div>
  );
}
