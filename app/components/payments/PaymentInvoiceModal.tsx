'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ExternalLink, Clock, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { CRYPTO_ASSETS, CryptoAssetId } from '@/lib/payments/types';

interface PaymentInvoiceProps {
  orderId: string;
  intent: {
    id: string;
    asset: string;
    depositAddress: string;
    expectedAmount: string;
    expectedAtomic: string;
    baseTotalUsd: number;
    exchangeRate?: number;
    status: string;
    expiresAt: string;
    txHash?: string;
    confirmations: number;
  };
  onPaymentConfirmed?: () => void;
  onCancel?: () => void;
}

export function PaymentInvoiceModal({ orderId, intent, onPaymentConfirmed, onCancel }: PaymentInvoiceProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [status, setStatus] = useState(intent.status);
  const [confirmations, setConfirmations] = useState(intent.confirmations);
  const [txHash, setTxHash] = useState(intent.txHash);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const assetMeta = CRYPTO_ASSETS[intent.asset as CryptoAssetId] || {
    id: intent.asset,
    name: intent.asset.toUpperCase(),
    symbol: intent.asset.toUpperCase(),
    network: 'Crypto Network',
    decimals: 8,
    minConfirmations: 1,
    explorerTxUrl: (tx: string) => `https://blockchair.com/search?q=${tx}`,
  };

  // Poll for payment updates every 15s
  useEffect(() => {
    if (status === 'CONFIRMED' || status === 'EXPIRED' || status === 'CANCELLED') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/payments/poll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });
        if (res.ok) {
          const data = await res.json();
          setStatus(data.status);
          setConfirmations(data.confirmations || 0);
          if (data.txHash) setTxHash(data.txHash);
          if (data.status === 'CONFIRMED' && onPaymentConfirmed) {
            onPaymentConfirmed();
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [orderId, status, onPaymentConfirmed]);

  // Expiration countdown
  useEffect(() => {
    const updateCountdown = () => {
      const diff = new Date(intent.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Expired');
        setStatus('EXPIRED');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [intent.expiresAt]);

  const copyToClipboard = (text: string, type: 'address' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  return (
    <div className="glass p-6 sm:p-8 max-w-lg w-full mx-auto space-y-6 animate-fade-in border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Pay with {assetMeta.name}
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">{assetMeta.network}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-400 block flex items-center gap-1 justify-end">
            <Clock className="w-3.5 h-3.5 text-zinc-400" /> Expires in
          </span>
          <span className="text-xs font-mono font-bold text-amber-400">{timeLeft}</span>
        </div>
      </div>

      {/* Payment Status Banner */}
      {status === 'DETECTED' && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3.5 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
          <div className="text-sm">
            <p className="font-semibold text-indigo-200">Transaction Detected on Network!</p>
            <p className="text-xs text-indigo-300/80">
              Confirmations: {confirmations} / {assetMeta.minConfirmations}
            </p>
          </div>
        </div>
      )}

      {status === 'CONFIRMED' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="font-bold text-emerald-200">Payment Confirmed & Verified</p>
            <p className="text-xs text-emerald-300/80">Your order is being processed.</p>
          </div>
        </div>
      )}

      {/* QR Code */}
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner max-w-[220px] mx-auto">
        <QRCodeSVG
          value={intent.depositAddress}
          size={190}
          level="M"
          includeMargin={false}
        />
      </div>

      {/* Copy Fields */}
      <div className="space-y-4">
        {/* Exact Amount */}
        <div>
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">
            Exact Amount to Send ({assetMeta.symbol})
          </label>
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5">
            <span className="font-mono text-base font-bold text-amber-400 flex-1 tabular-nums">
              {intent.expectedAmount} {assetMeta.symbol}
            </span>
            <button
              onClick={() => copyToClipboard(intent.expectedAmount, 'amount')}
              className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition"
              title="Copy Amount"
            >
              {copiedAmount ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            * Send this exact amount. Sub-cent unique offset matches your payment automatically.
          </p>
        </div>

        {/* Deposit Address */}
        <div>
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">
            Merchant Deposit Address
          </label>
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5">
            <span className="font-mono text-xs text-zinc-200 truncate flex-1 select-all">
              {intent.depositAddress}
            </span>
            <button
              onClick={() => copyToClipboard(intent.depositAddress, 'address')}
              className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition"
              title="Copy Address"
            >
              {copiedAddress ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Explorer Deep Link */}
      {txHash && (
        <div className="text-center pt-2">
          <a
            href={assetMeta.explorerTxUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            View on Blockchain Explorer <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-white/8">
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            Choose different payment method
          </button>
        )}
        <div className="text-right text-[11px] text-zinc-500 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Non-Custodial Direct
        </div>
      </div>
    </div>
  );
}
