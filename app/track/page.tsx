'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Search, Package, Clock, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

export default function TrackOrderPage() {
  const [code, setCode] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingCode: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Order lookup failed');
      }
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Public Order Tracking</h1>
          <p className="text-xs text-zinc-400">
            Look up your order status, payment verification, and carrier tracking code anonymously.
          </p>
        </div>

        {/* Tracking Search Form */}
        <form onSubmit={handleTrack} className="glass p-4 sm:p-6 border border-white/10 rounded-2xl space-y-3">
          <label className="text-xs font-semibold text-zinc-300 block">
            Enter Order Number (e.g. ORD-XXXXX) or Tracking Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. ORD-9X28F or TRK-A91B87..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="form-input text-xs uppercase"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary text-xs px-5 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Search className="w-4 h-4" /> {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
        </form>

        {error && (
          <div className="glass p-4 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Order Details Display */}
        {order && (
          <div className="glass p-6 sm:p-8 border border-white/10 rounded-2xl space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-zinc-500 block">Order Reference</span>
                <h3 className="text-lg font-bold text-white">{order.orderNumber}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.paymentStatus === 'PAID'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  Payment: {order.paymentStatus}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Status: {order.status}
                </span>
              </div>
            </div>

            {/* Carrier Tracking */}
            {order.trackingNumber && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-indigo-300 block font-semibold">
                    Carrier Tracking ({order.carrier || 'Standard'})
                  </span>
                  <span className="font-mono text-xs text-white select-all">{order.trackingNumber}</span>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Order Items</h4>
              <div className="space-y-2">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs glass p-3 border border-white/5 rounded-xl">
                    <div>
                      <p className="font-semibold text-white">{item.productName}</p>
                      <p className="text-zinc-400">{item.variantName} × {item.quantity}</p>
                    </div>
                    <span className="font-mono text-zinc-200">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline pt-4 border-t border-white/8">
              <span className="text-xs text-zinc-400">Total Charged</span>
              <span className="text-price text-lg font-bold">${order.total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
