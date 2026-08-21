'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCartStore } from '@/lib/cartStore';
import { CRYPTO_ASSETS, CryptoAssetId } from '@/lib/payments/types';
import { ShieldCheck, Lock, ArrowRight, Truck } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, total, appliedCoupon, clearCart } = useCartStore();

  const [email, setEmail] = useState('');
  const [contactHandle, setContactHandle] = useState('');
  const [fullName, setFullName] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('US');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [selectedAsset, setSelectedAsset] = useState<CryptoAssetId>('btc');
  const [availableMethods, setAvailableMethods] = useState<any[]>([]);
  const [customerNotes, setCustomerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadMethods() {
      try {
        const res = await fetch('/api/payments/methods');
        if (res.ok) {
          const data = await res.json();
          setAvailableMethods(data.methods || []);
          if (data.methods?.length > 0) {
            setSelectedAsset(data.methods[0].id);
          }
        }
      } catch (e) {
        console.error('Failed to load payment methods:', e);
      }
    }
    loadMethods();
  }, []);

  const shippingFee = shippingMethod === 'express' ? 25.0 : 10.0;
  const finalTotal = total() + shippingFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
        <Navbar />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
          <p className="text-sm text-zinc-400">Please add items to your cart before proceeding to checkout.</p>
          <Link href="/" className="btn btn-primary">Return to Catalog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        guestEmail: email,
        guestContact: contactHandle,
        shippingAddress: {
          fullName,
          line1,
          line2,
          city,
          state: stateVal,
          zip,
          country,
        },
        shippingMethod,
        items,
        couponCode: appliedCoupon?.code,
        cryptoAsset: selectedAsset,
        customerNotes,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      clearCart();
      router.push(`/checkout/pay/${data.orderId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while creating your order');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Checkout</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Private, KYC-free cryptocurrency ordering
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="glass p-6 border border-white/8 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/8 pb-3">
                <Lock className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Contact Details (Guest / Private)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">
                    Email Address <span className="text-zinc-500 text-[11px]">(for tracking updates)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="buyer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input text-xs"
                    required={!contactHandle}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">
                    Telegram / Signal Handle <span className="text-zinc-500 text-[11px]">(Optional alternative)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="@yourhandle"
                    value={contactHandle}
                    onChange={(e) => setContactHandle(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="glass p-6 border border-white/8 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/8 pb-3">
                <Truck className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Delivery Destination
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-input text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    className="form-input text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Apt, Suite, Unit (Optional)</label>
                  <input
                    type="text"
                    placeholder="Apt 4B"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-input text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">State / Province</label>
                    <input
                      type="text"
                      placeholder="State"
                      value={stateVal}
                      onChange={(e) => setStateVal(e.target.value)}
                      className="form-input text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">Postal Code</label>
                    <input
                      type="text"
                      placeholder="Zip"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="form-input text-xs"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptocurrency Rail Selector */}
            <div className="glass p-6 border border-white/8 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/8 pb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Select Payment Currency
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(CRYPTO_ASSETS).map(([id, meta]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedAsset(id as CryptoAssetId)}
                    className={`glass p-3.5 rounded-xl text-left border flex items-center justify-between transition cursor-pointer ${
                      selectedAsset === id
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-md shadow-indigo-500/10'
                        : 'border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{meta.name}</p>
                      <p className="text-[11px] text-zinc-400">{meta.network}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-300">
                      {meta.symbol}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="space-y-6">
            <div className="glass p-6 border border-white/8 space-y-4 sticky top-24">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/8 pb-3">
                Order Breakdown
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex justify-between text-xs">
                    <div>
                      <span className="text-white font-medium">{item.productName}</span>
                      <span className="text-zinc-400 block">{item.variantName} × {item.quantity}</span>
                    </div>
                    <span className="font-mono text-zinc-200">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-white/8 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200">${subtotal().toFixed(2)}</span>
                </div>
                {discount() > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount</span>
                    <span className="font-mono">-${discount().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-zinc-200">${shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/8">
                  <span>Total Amount</span>
                  <span className="text-price text-lg font-black">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Generating Invoice...' : 'Generate Crypto Invoice'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
