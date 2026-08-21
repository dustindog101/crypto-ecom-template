'use client';

import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface UploadSlotProps {
  label: string;
  onUploaded: (fileKey: string, publicUrl?: string) => void;
  accept?: string;
}

export function UploadSlot({ label, onUploaded, accept = 'image/png,image/jpeg' }: UploadSlotProps) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setFileName(file.name);

    try {
      // 1. Get Presigned URL
      const res = await fetch('/api/uploads/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.type }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get upload slot');

      // 2. Direct PUT upload
      if (!data.mock && data.uploadUrl) {
        const uploadRes = await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!uploadRes.ok) throw new Error('Direct upload failed');
      }

      setSuccess(true);
      onUploaded(data.key, data.publicUrl);
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass p-4 border border-white/8 rounded-xl space-y-2">
      <label className="text-xs font-semibold text-zinc-300 block">{label}</label>

      <div className="relative border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-xl p-4 text-center transition cursor-pointer">
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-xs text-indigo-400">
            <RefreshCw className="w-4 h-4 animate-spin" /> Uploading {fileName}...
          </div>
        ) : success ? (
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> {fileName} attached
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-xs text-zinc-400">
            <Upload className="w-5 h-5 text-zinc-500" />
            <span>Click or drag file to upload</span>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
