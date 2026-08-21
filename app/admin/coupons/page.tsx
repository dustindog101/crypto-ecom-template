'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Tag, Check, Trash2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [value, setValue] = useState('10');
  const [minOrder, setMinOrder] = useState('0');
  const [creating, setCreating] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discountType,
          value,
          minOrder,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setCode('');
        await fetchCoupons();
      }
    } catch (err) {
      console.error('Failed to create coupon:', err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-zinc-500 text-xs">Loading coupons...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Promotions & Coupons</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage marketing discount codes and thresholds.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="glass p-6 border border-white/8 rounded-2xl space-y-4">
        {coupons.length === 0 ? (
          <p className="text-xs text-zinc-500 py-8 text-center">No coupons configured.</p>
        ) : (
          <div className="space-y-3">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 bg-white/[0.02] border border-white/6 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-300 text-sm tracking-wider">{c.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/8 text-zinc-400">
                      {c.discountType === 'PERCENT' ? `${c.value}% Off` : `$${c.value.toFixed(2)} Off`}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Min order: ${c.minOrder.toFixed(2)} • Used: {c.usedCount} times
                  </p>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  c.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-400'
                }`}>
                  {c.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass p-6 max-w-md w-full rounded-2xl border border-white/10 space-y-4 bg-[#0e0e11]">
            <h3 className="text-lg font-bold text-white">Create Promo Code</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-300 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. FLASH25"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="form-input text-xs uppercase font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="form-input text-xs bg-[#121215]"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-300 block mb-1">Value</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="10"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="form-input text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1">Minimum Order ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary text-xs"
                >
                  {creating ? 'Creating...' : 'Create Promo Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
