'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface AnnouncementBannerProps {
  message?: string;
}

export function AnnouncementBanner({ message = '⚡ Special Launch: Use promo code WELCOME10 for 10% off your first crypto order!' }: AnnouncementBannerProps) {
  if (!message) return null;

  return (
    <div className="bg-indigo-600/15 border-b border-indigo-500/20 px-4 py-2 text-center text-xs font-semibold text-indigo-300 flex items-center justify-center gap-2">
      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
      <span>{message}</span>
    </div>
  );
}
