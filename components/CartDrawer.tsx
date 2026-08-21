'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (code === 'WELCOME10') {
      applyCoupon({ code, discountType: 'PERCENT', value: 10 });
      setCouponInput('');
    } else if (code === 'CRYPTO20') {
      applyCoupon({ code, discountType: 'FIXED', value: 20 });
      setCouponInput('');
    } else {
      setCouponError('Invalid promo code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e0e11] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/8">
            <h3 className="text-lg font-bold text-white tracking-tight">Your Cart</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-sm">
                Your cart is currently empty.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="glass p-3.5 flex items-center justify-between gap-3 border border-white/6 rounded-xl"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{item.productName}</h4>
                    <p className="text-xs text-zinc-400">{item.variantName}</p>
                    <span className="text-price text-xs font-bold">${item.price.toFixed(2)}</span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-semibold text-white px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/8">
              {/* Coupon Form */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="form-input text-xs py-2 uppercase"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="btn btn-outline text-xs px-3 py-2"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-xs text-red-400">{couponError}</p>}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
                  <span className="flex items-center gap-1 font-mono">
                    <Tag className="w-3 h-3" /> {appliedCoupon.code} applied
                  </span>
                  <button
                    onClick={() => applyCoupon(null)}
                    className="text-zinc-400 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200">${subtotal().toFixed(2)}</span>
                </div>
                {discount() > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-${discount().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/8">
                  <span>Estimated Total</span>
                  <span className="text-price text-base">${total().toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="btn btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Private Non-Custodial Settlement
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
