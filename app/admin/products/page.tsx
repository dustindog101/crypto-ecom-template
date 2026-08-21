'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Package, Check, Trash2, Edit2, Shield } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New product form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('hardware');
  const [categoryLabel, setCategoryLabel] = useState('Hardware');
  const [description, setDescription] = useState('');
  const [isDigital, setIsDigital] = useState(false);
  const [variantName, setVariantName] = useState('Standard');
  const [variantPrice, setVariantPrice] = useState('49.00');
  const [creating, setCreating] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          category,
          categoryLabel,
          description,
          isDigital,
          variants: [
            {
              displayName: variantName,
              sku: `${slug.toUpperCase()}-STD`,
              price: parseFloat(variantPrice),
              stockQty: 100,
            },
          ],
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setName('');
        setSlug('');
        setDescription('');
        await fetchProducts();
      }
    } catch (err) {
      console.error('Error creating product:', err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-zinc-500 text-xs">Loading products catalog...</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Product Catalog</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage items, variants, custom form schemas, and pricing.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Product List */}
      <div className="glass p-6 border border-white/8 rounded-2xl space-y-4">
        {products.length === 0 ? (
          <p className="text-xs text-zinc-500 py-8 text-center">No products found in the catalog.</p>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="p-4 bg-white/[0.02] border border-white/6 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{p.name}</span>
                    <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/8 px-1.5 py-0.5 rounded text-zinc-400">
                      {p.categoryLabel}
                    </span>
                    {p.isDigital && (
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
                        Digital
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">{p.description || 'No description'}</p>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Variants: {p.variants?.map((v: any) => `${v.displayName} ($${v.price})`).join(' | ')}
                  </p>
                </div>

                <span className="text-price font-bold text-sm">
                  ${p.variants?.length > 0 ? p.variants[0].price.toFixed(2) : '0.00'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass p-6 max-w-lg w-full rounded-2xl border border-white/10 space-y-4 bg-[#0e0e11]">
            <h3 className="text-lg font-bold text-white">Create New Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-300 block mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Privacy Router"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="form-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1">Slug URL</label>
                <input
                  type="text"
                  placeholder="e.g. privacy-router"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="form-input text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1">Category Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Hardware"
                    value={categoryLabel}
                    onChange={(e) => setCategoryLabel(e.target.value)}
                    className="form-input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-300 block mb-1">Variant Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="49.00"
                    value={variantPrice}
                    onChange={(e) => setVariantPrice(e.target.value)}
                    className="form-input text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1">Short Description</label>
                <textarea
                  placeholder="Summary description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input text-xs min-h-[60px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={isDigital}
                  onChange={(e) => setIsDigital(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-white/5 border-white/10"
                />
                <label className="text-xs text-zinc-300">Instant Digital Delivery Deliverable</label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-outline text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary text-xs"
                >
                  {creating ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
