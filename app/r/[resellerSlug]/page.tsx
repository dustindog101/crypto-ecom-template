import React from 'react';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductCard } from '@/components/ProductCard';
import { Shield, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function ResellerStorefrontPage({
  params,
}: {
  params: Promise<{ resellerSlug: string }>;
}) {
  const { resellerSlug } = await params;

  let profile = null;
  let products: any[] = [];

  try {
    profile = await prisma.resellerProfile.findUnique({
      where: { slug: resellerSlug },
    });

    if (!profile || !profile.isActive) {
      notFound();
    }

    products = await prisma.product.findMany({
      include: {
        variants: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    notFound();
  }

  const branding = profile.brandingJson ? JSON.parse(profile.brandingJson) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="glass p-8 sm:p-12 text-center space-y-4 rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-transparent">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" /> Authorized Partner Storefront
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {branding?.heroTitle || profile.businessName}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Direct crypto purchasing powered by self-custodial settlement.
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Available Inventory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const startingPrice = product.variants.length > 0
                ? Math.min(...product.variants.map((v: any) => v.price))
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
