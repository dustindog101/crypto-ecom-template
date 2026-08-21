'use client';

import React, { useState, useEffect } from 'react';
import { CRYPTO_ASSETS, CryptoAssetId } from '@/lib/payments/types';
import { ShieldCheck, Save, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Key } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [gateways, setGateways] = useState<Record<string, any>>({});
  const [ttlHours, setTtlHours] = useState(48);
  const [intents, setIntents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/payments');
        if (res.ok) {
          const data = await res.json();
          setGateways(data.gateways || {});
          setTtlHours(data.paymentIntentTtlHours || 48);
          setIntents(data.intents || []);
        }
      } catch (err) {
        console.error('Failed to load payments admin:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggle = (assetId: string, enabled: boolean) => {
    setGateways((prev) => ({
      ...prev,
      [assetId]: {
        ...(prev[assetId] || {}),
        enabled,
      },
    }));
  };

  const handleKeyChange = (assetId: string, keyOrAddress: string) => {
    setGateways((prev) => ({
      ...prev,
      [assetId]: {
        ...(prev[assetId] || {}),
        xpub: keyOrAddress,
        address: keyOrAddress,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateways, paymentIntentTtlHours: ttlHours }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setSaveStatus('error');
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-zinc-500 text-xs">Loading Payments Hub...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Payments Hub</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure extended public keys (zpub / xpub) for unique per-order address derivation, or static wallet addresses.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary text-xs px-5 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Gateway Settings
        </button>
      </div>

      {saveStatus === 'success' && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Payment gateway settings updated successfully.
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {errorMessage}
        </div>
      )}

      {/* Gateway Configuration Cards */}
      <div className="glass p-6 border border-white/8 rounded-2xl space-y-6">
        <div className="border-b border-white/8 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Supported Payment Gateways & Extended Keys
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Enter your BIP84 zpub (for Bitcoin Native SegWit bc1q...), xpub / Ltub (for Litecoin), or static address.
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(CRYPTO_ASSETS).map(([id, meta]) => {
            const gw = gateways[id] || { enabled: false, xpub: '', address: '', nextIndex: 0 };
            const keyVal = gw.xpub || gw.address || '';
            const isExtendedKey = keyVal.startsWith('zpub') || keyVal.startsWith('xpub') || keyVal.startsWith('ypub') || keyVal.startsWith('Ltub');

            return (
              <div key={id} className="p-4 bg-white/[0.02] border border-white/6 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={gw.enabled}
                      onChange={(e) => handleToggle(id, e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-white/5 border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{meta.name}</span>
                        {isExtendedKey && (
                          <span className="text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-500/30 flex items-center gap-1">
                            <Key className="w-2.5 h-2.5" /> BIP84 Auto-Derive (Index: {gw.nextIndex || 0})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-500">{meta.network}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-400">{meta.symbol}</span>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">
                    {id === 'btc' ? 'Bitcoin zpub (BIP84) or static address' : id === 'ltc' ? 'Litecoin xpub / Ltub or address' : `${meta.name} xpub or deposit address`}
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter ${meta.symbol} zpub/xpub or deposit address...`}
                    value={keyVal}
                    onChange={(e) => handleKeyChange(id, e.target.value)}
                    className="form-input text-xs font-mono select-all"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Payment Activity Ledger */}
      <div className="glass p-6 border border-white/8 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/8 pb-3">
          Live Payment Invoices & Derived Addresses
        </h3>

        {intents.length === 0 ? (
          <p className="text-xs text-zinc-500 py-6 text-center">No payment intents recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-500 border-b border-white/8">
                <tr>
                  <th className="py-2">Order</th>
                  <th className="py-2">Asset</th>
                  <th className="py-2">Derived Deposit Address</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Tx Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {intents.map((intent) => {
                  const meta = CRYPTO_ASSETS[intent.asset as CryptoAssetId];
                  return (
                    <tr key={intent.id}>
                      <td className="py-3 font-mono font-bold text-white">{intent.order?.orderNumber}</td>
                      <td className="py-3 uppercase font-mono text-indigo-400">{intent.asset}</td>
                      <td className="py-3 font-mono text-zinc-300 truncate max-w-[180px] select-all">
                        {intent.depositAddress}
                        {intent.addressIndex !== null && intent.addressIndex !== undefined && (
                          <span className="text-[10px] text-zinc-500 ml-1 font-mono">
                            (#{intent.addressIndex})
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-mono text-zinc-200">{intent.expectedAmount}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          intent.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {intent.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-zinc-400">
                        {intent.txHash ? (
                          <a
                            href={meta ? meta.explorerTxUrl(intent.txHash) : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:underline flex items-center gap-1 truncate max-w-[130px]"
                          >
                            {intent.txHash.slice(0, 8)}... <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          'None'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
