'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Copy, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ResellerDashboardPage() {
  const [copied, setCopied] = useState(false);
  const demoSlug = 'apex-store';
  const storefrontUrl = typeof window !== 'undefined' ? `${window.location.origin}/r/${demoSlug}` : `/r/${demoSlug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(storefrontUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reseller Portal</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your white-label storefront and monitor wholesale tier commissions.
          </p>
        </div>

        <div className="glass p-6 border border-white/10 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your White-Label Store URL</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active Tier: 15% Wholesale
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5">
            <span className="font-mono text-xs text-indigo-300 flex-1 truncate select-all">{storefrontUrl}</span>
            <button
              onClick={copyLink}
              className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <Link
              href={`/r/${demoSlug}`}
              target="_blank"
              className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="glass p-6 border border-white/8 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/8 pb-3">
            Wholesale Volume Discount Schedule
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white/[0.02] border border-white/6 rounded-xl text-center">
              <span className="text-xs text-zinc-500 block">1 - 4 Units</span>
              <span className="text-price font-bold text-base">Standard</span>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/6 rounded-xl text-center">
              <span className="text-xs text-zinc-500 block">5 - 19 Units</span>
              <span className="text-price font-bold text-base">10% Off</span>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/6 rounded-xl text-center">
              <span className="text-xs text-zinc-500 block">20 - 49 Units</span>
              <span className="text-price font-bold text-base">20% Off</span>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/6 rounded-xl text-center">
              <span className="text-xs text-zinc-500 block">50+ Units</span>
              <span className="text-price font-bold text-base">30% Off</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
