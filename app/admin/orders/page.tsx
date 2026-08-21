'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Check, Edit2, Save, RefreshCw } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editPaymentStatus, setEditPaymentStatus] = useState('');
  const [editCarrier, setEditCarrier] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStartEdit = (order: any) => {
    setEditingId(order.id);
    setEditStatus(order.status);
    setEditPaymentStatus(order.paymentStatus);
    setEditCarrier(order.carrier || '');
    setEditTracking(order.trackingNumber || '');
  };

  const handleSaveEdit = async (orderId: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: editStatus,
          paymentStatus: editPaymentStatus,
          carrier: editCarrier,
          trackingNumber: editTracking,
        }),
      });

      if (res.ok) {
        setEditingId(null);
        await fetchOrders();
      }
    } catch (err) {
      console.error('Error saving order edit:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-zinc-500 text-xs">Loading orders...</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Order Fulfillment</h1>
        <p className="text-xs text-zinc-400 mt-1">Manage and update customer order fulfillment statuses.</p>
      </div>

      <div className="glass p-6 border border-white/8 rounded-2xl space-y-4">
        {orders.length === 0 ? (
          <p className="text-xs text-zinc-500 py-8 text-center">No customer orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isEditing = editingId === order.id;

              return (
                <div key={order.id} className="p-4 bg-white/[0.02] border border-white/6 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/6 pb-3">
                    <div>
                      <span className="font-mono font-bold text-white text-sm block">{order.orderNumber}</span>
                      <span className="text-[11px] text-zinc-500 font-mono select-all">
                        Tracking Code: {order.trackingCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-price font-bold text-sm">${order.total.toFixed(2)}</span>
                      {!isEditing ? (
                        <button
                          onClick={() => handleStartEdit(order)}
                          className="btn btn-outline text-xs px-2.5 py-1 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSaveEdit(order.id)}
                          disabled={saving}
                          className="btn btn-primary text-xs px-3 py-1 flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Details & Editor */}
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Order Status</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="form-input text-xs py-1.5 bg-[#121215]"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Payment Status</label>
                        <select
                          value={editPaymentStatus}
                          onChange={(e) => setEditPaymentStatus(e.target.value)}
                          className="form-input text-xs py-1.5 bg-[#121215]"
                        >
                          <option value="UNPAID">UNPAID</option>
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="UNDERPAID">UNDERPAID</option>
                          <option value="REFUNDED">REFUNDED</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Carrier</label>
                        <input
                          type="text"
                          placeholder="e.g. USPS, FedEx"
                          value={editCarrier}
                          onChange={(e) => setEditCarrier(e.target.value)}
                          className="form-input text-xs py-1.5"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Tracking Number</label>
                        <input
                          type="text"
                          placeholder="Carrier tracking #"
                          value={editTracking}
                          onChange={(e) => setEditTracking(e.target.value)}
                          className="form-input text-xs py-1.5"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-4">
                      <div className="space-y-1">
                        <p className="text-zinc-300">
                          <span className="text-zinc-500">Contact:</span> {order.guestEmail || order.guestContact || 'Anonymous'}
                        </p>
                        <p>
                          <span className="text-zinc-500">Items:</span> {order.items?.map((i: any) => `${i.productName} (${i.quantity})`).join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                          order.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          Payment: {order.paymentStatus}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full font-semibold text-[10px] bg-indigo-500/10 text-indigo-300">
                          Status: {order.status}
                        </span>
                        {order.trackingNumber && (
                          <span className="text-zinc-300 font-mono text-[11px]">
                            {order.carrier || 'Tracking'}: {order.trackingNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
