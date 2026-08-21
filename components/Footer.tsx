import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#09090B] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <p className="text-xs text-zinc-400">
              © {new Date().getFullYear()} {SITE_CONFIG.name}. Self-Custodial & Private Crypto Commerce.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <Link href="/track" className="hover:text-zinc-300 transition">Track Order</Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition">Privacy Notice</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition">Terms of Sale</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
