'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Shield, Search, User } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { SITE_CONFIG } from '@/lib/config';

export function Navbar() {
  const items = useCartStore((state) => state.items);
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#09090B]/80 border-b border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/60 transition">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-white group-hover:text-indigo-200 transition">
              {SITE_CONFIG.name}
            </span>
            <span className="text-[10px] block font-mono text-zinc-500 tracking-wider uppercase">
              Crypto E-Commerce
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <Link href="/" className="hover:text-white transition">Catalog</Link>
          <Link href="/track" className="hover:text-white transition">Track Order</Link>
          {SITE_CONFIG.features.enableAffiliates && (
            <Link href="/affiliate" className="hover:text-white transition">Affiliates</Link>
          )}
          {SITE_CONFIG.features.enableReseller && (
            <Link href="/reseller" className="hover:text-white transition">Resellers</Link>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/track"
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition"
            title="Track Order"
          >
            <Search className="w-5 h-5" />
          </Link>

          <Link
            href="/admin"
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition"
            title="Admin Dashboard"
          >
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-white transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold">{totalItems}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
