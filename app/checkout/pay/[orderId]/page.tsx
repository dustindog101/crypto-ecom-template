'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PaymentInvoiceModal } from '@/components/payments/PaymentInvoiceModal';
import { CRYPTO_ASSETS, CryptoAssetId } from '@/lib/payments/types';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PayOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const [intent, setIntent] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAssetId>('btc');
  const [loading, setLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState('');

  const fetchOrCreateIntent = async (asset: CryptoAssetId) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, asset }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment intent');
      }
      setIntent(data.intent);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrCreateIntent(selectedAsset);
    }
  }, [orderId]);

  const handleAssetSwitch = (newAsset: CryptoAssetId) => {
    setSelectedAsset(newAsset);
    fetchOrCreateIntent(newAsset);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isConfirmed ? (
          <div className="glass p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto border border-emerald-500/30 rounded-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Payment Successfully Received!</h1>
              <p className="text-xs text-zinc-400">
                Your order has been verified on the blockchain and queued for fulfillment.
              </p>
            </div>

            <div className="pt-4 border-t border-white/8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/track" className="btn btn-primary text-xs">
                Track Order Progress <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/" className="btn btn-outline text-xs">
                Return to Store
              </Link>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-zinc-400">Generating secure payment intent...</p>
          </div>
        ) : error ? (
          <div className="glass p-8 text-center space-y-4 border border-red-500/30 max-w-md mx-auto">
            <p className="text-sm text-red-400 font-semibold">{error}</p>
            <button onClick={() => fetchOrCreateIntent(selectedAsset)} className="btn btn-outline text-xs">
              Retry Payment
            </button>
          </div>
        ) : intent ? (
          <PaymentInvoiceModal
            orderId={orderId}
            intent={intent}
            onPaymentConfirmed={() => setIsConfirmed(true)}
            onCancel={() => {
              // Open modal or dropdown to switch currency
              const nextAsset: CryptoAssetId = selectedAsset === 'btc' ? 'sol' : 'btc';
              handleAssetSwitch(nextAsset);
            }}
          />
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
