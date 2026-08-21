'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, CreditCard, Tag, Shield, ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/payments', label: 'Payments Hub', icon: CreditCard },
    { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#09090B] text-zinc-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/8 bg-[#0c0c0f] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white">Backoffice</span>
            </Link>
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Store
            </Link>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/6 text-[11px] text-zinc-500">
          Logged in as Administrator
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
