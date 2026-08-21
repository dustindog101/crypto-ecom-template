'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CustomSchemaForm, CustomFieldSpec } from '@/components/CustomSchemaForm';
import { useCartStore } from '@/lib/cartStore';
import { ShoppingBag, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [customValues, setCustomValues] = useState<Record<string, any>>({});
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          if (data.product?.variants?.length > 0) {
            setSelectedVariantId(data.product.variants[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
        <Navbar />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
          <p className="text-sm text-zinc-400">The requested product could not be located in the catalog.</p>
          <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedVariant = product.variants.find((v: any) => v.id === selectedVariantId) || product.variants[0];
  const customSchema: CustomFieldSpec[] = product.customSchema ? JSON.parse(product.customSchema) : [];

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantName: selectedVariant.displayName,
      sku: selectedVariant.sku,
      price: selectedVariant.price,
      quantity,
      imageUrl: product.imageUrl,
      customValues: Object.keys(customValues).length > 0 ? customValues : undefined,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Media & Overview */}
          <div className="space-y-6">
            <div className="glass aspect-square rounded-2xl flex items-center justify-center p-8 border border-white/10 relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono uppercase text-indigo-400 font-semibold block">
                  {product.categoryLabel}
                </span>
                <h3 className="text-2xl font-black text-white px-4">
                  {product.name}
                </h3>
              </div>
            </div>

            {product.longDescription && (
              <div className="glass p-6 border border-white/8 space-y-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">About This Item</h4>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                  {product.longDescription}
                </p>
              </div>
            )}
          </div>

          {/* Configuration & Purchase Column */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                {product.categoryLabel}
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {product.name}
              </h1>
              {product.description && (
                <p className="text-sm text-zinc-400 mt-2">{product.description}</p>
              )}
            </div>

            {/* Price Snapshot */}
            <div className="glass p-4 border border-white/8 rounded-xl flex items-baseline gap-3">
              <span className="text-price text-3xl font-black tabular-nums">
                ${selectedVariant ? selectedVariant.price.toFixed(2) : '0.00'}
              </span>
              <span className="text-xs text-zinc-400 font-mono">USD in Crypto</span>
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                  Select Configuration / Option
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`glass p-3.5 rounded-xl text-left border flex items-center justify-between transition cursor-pointer ${
                        selectedVariantId === v.id
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                          : 'border-white/8 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{v.displayName}</p>
                        <p className="text-[11px] font-mono text-zinc-400">SKU: {v.sku}</p>
                      </div>
                      <span className="text-price text-sm font-bold">${v.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Custom Schema Inputs (if configured) */}
            {customSchema.length > 0 && (
              <CustomSchemaForm
                fields={customSchema}
                values={customValues}
                onChange={(fieldId, val) =>
                  setCustomValues((prev) => ({ ...prev, [fieldId]: val }))
                }
              />
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-white/8">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-zinc-400 hover:text-white px-2 py-1"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-bold text-white px-3">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-zinc-400 hover:text-white px-2 py-1"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
              </div>

              {addedNotice && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" /> Item added to cart!
                </div>
              )}

              <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Private payment verified directly on-chain
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
