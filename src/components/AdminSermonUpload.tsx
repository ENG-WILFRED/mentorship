"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function AdminSermonUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preacher, setPreacher] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [displayedProgress, setDisplayedProgress] = useState<number>(0);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

  // Smoothly animate the visible percent up to the actual upload progress
  useEffect(() => {
    if (progress === null) {
      setDisplayedProgress(0);
      return;
    }

    const interval = window.setInterval(() => {
      setDisplayedProgress((prev) => {
        if (prev >= (progress ?? 0)) {
          window.clearInterval(interval);
          return progress ?? prev;
        }
        // step faster when gap is large
        const step = prev + Math.max(1, Math.ceil((progress! - prev) / 8));
        return Math.min(step, progress ?? 100);
      });
    }, 60);

    return () => {
      window.clearInterval(interval);
    };
  }, [progress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Pick a file');

    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('description', description);
    form.append('preacher', preacher);

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE}/sermons/upload`);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            const p = Math.round((ev.loaded / ev.total) * 100);
            setProgress(p);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // ensure UI shows 100% before finishing
            setProgress(100);
            setDisplayedProgress(100);
            setResult(JSON.parse(xhr.responseText));
            resolve();
          } else {
            reject(xhr.responseText);
          }
        };
        xhr.onerror = () => reject('Upload failed');
        xhr.send(form);
      });

      // keep 100% visible briefly then reset
      setTimeout(() => setProgress(null), 700);
      alert('Upload complete');
    } catch (err) {
      console.error(err);
      alert('Upload error: ' + JSON.stringify(err));
      setProgress(null);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => router.push('/mentor/sermons')}
          aria-label="Go back to sermons"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-2 rounded-md font-semibold hover:opacity-95 transition"
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm">Back to Sermons</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Video File</label>
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>

        <div>
          <label className="block font-semibold">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-2 py-1" />
        </div>

        <div>
          <label className="block font-semibold">Preacher</label>
          <input value={preacher} onChange={(e) => setPreacher(e.target.value)} className="w-full border rounded px-2 py-1" />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-2 py-1" />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload to YouTube</button>
          <button type="button" onClick={() => { setFile(null); setTitle(''); setDescription(''); setPreacher(''); setProgress(null); setResult(null); }} className="px-3 py-2 border rounded">Clear</button>
        </div>

        {progress !== null && (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-3 bg-blue-600 transition-all" style={{ width: `${displayedProgress}%` }} />
            </div>
            <div className="text-sm text-gray-700 mt-1">Uploading: {displayedProgress}%</div>
          </div>
        )}

        {result && <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>}
      </form>
    </div>
  );
}
