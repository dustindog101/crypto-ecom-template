import React from 'react';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductCard } from '@/components/ProductCard';
import { ShieldCheck, Zap, Lock, RefreshCw } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export const revalidate = 60;

export default async function HomePage() {
  let products = [];
  try {
    products = await prisma.product.findMany({
      include: {
        variants: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.warn('Prisma query failed (db may need push/seed):', error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto py-12 sm:py-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <Lock className="w-3.5 h-3.5" /> Self-Custodial & KYC-Free Commerce
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Next-Gen Crypto <span className="text-indigo-400">Storefront</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Direct on-chain settlements across Bitcoin, Litecoin, Solana, and EVM networks. Zero middleman fees, instant order tracking, and dynamic product customizations.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-left">
            <div className="glass p-4 border border-white/6 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Direct Wallets</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Non-custodial merchant addresses</p>
            </div>
            <div className="glass p-4 border border-white/6 rounded-xl">
              <Zap className="w-5 h-5 text-amber-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Instant Verification</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Live blockchain polling</p>
            </div>
            <div className="glass p-4 border border-white/6 rounded-xl">
              <Lock className="w-5 h-5 text-indigo-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Guest Checkout</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">No mandatory registration</p>
            </div>
            <div className="glass p-4 border border-white/6 rounded-xl">
              <RefreshCw className="w-5 h-5 text-sky-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Reseller Portals</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">White-label & wholesale tiers</p>
            </div>
          </div>
        </section>

        {/* Product Catalog Grid */}
        <section className="py-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/8 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Product Catalog</h2>
              <p className="text-xs text-zinc-400">Select any product to customize variants and order</p>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {products.length} Products Available
            </span>
          </div>

          {products.length === 0 ? (
            <div className="glass p-12 text-center text-zinc-400 space-y-3 rounded-2xl">
              <p className="text-sm font-semibold text-white">No products found in the database.</p>
              <p className="text-xs text-zinc-500">
                Run <code className="text-indigo-300 font-mono bg-white/5 px-2 py-1 rounded">npm run db:push && npm run db:seed</code> to populate demo catalog items.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const startingPrice = product.variants.length > 0
                  ? Math.min(...product.variants.map((v) => v.price))
                  : 0;

                return (
                  <ProductCard
                    key={product.id}
                    slug={product.slug}
                    name={product.name}
                    categoryLabel={product.categoryLabel}
                    description={product.description}
                    startingPrice={startingPrice}
                    featured={product.featured}
                    isDigital={product.isDigital}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
