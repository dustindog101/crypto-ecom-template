'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Copy, Check, ExternalLink, DollarSign, Users, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const demoCode = 'VIP2026';
  const referralUrl = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${demoCode}` : `/?ref=${demoCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Affiliate Partner Hub</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Earn 10% commission on every verified cryptocurrency sale referred through your link.
          </p>
        </div>

        {/* Tracking Link Box */}
        <div className="glass p-6 border border-white/10 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your Personal Referral Link</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Commission Rate: 10%
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5">
            <span className="font-mono text-xs text-indigo-300 flex-1 truncate select-all">{referralUrl}</span>
            <button
              onClick={copyLink}
              className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass p-6 border border-white/8 rounded-2xl space-y-2">
            <span className="text-xs text-zinc-400 uppercase tracking-wider block font-semibold">Total Earned</span>
            <p className="text-price text-3xl font-black">$0.00</p>
            <span className="text-[11px] text-zinc-500 block">Lifetime earnings</span>
          </div>

          <div className="glass p-6 border border-white/8 rounded-2xl space-y-2">
            <span className="text-xs text-zinc-400 uppercase tracking-wider block font-semibold">Pending Balance</span>
            <p className="text-3xl font-black text-white">$0.00</p>
            <span className="text-[11px] text-zinc-500 block">Available for payout</span>
          </div>

          <div className="glass p-6 border border-white/8 rounded-2xl space-y-2">
            <span className="text-xs text-zinc-400 uppercase tracking-wider block font-semibold">Attributed Orders</span>
            <p className="text-3xl font-black text-white">0</p>
            <span className="text-[11px] text-zinc-500 block">Verified purchases</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
