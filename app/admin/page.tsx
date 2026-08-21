import React from 'react';
import { prisma } from '@/lib/prisma';
import { DollarSign, ShoppingBag, Users, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  let orderCount = 0;
  let totalRevenue = 0;
  let paidOrders = 0;
  let recentOrders: any[] = [];

  try {
    orderCount = await prisma.order.count();
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: true },
    });
    recentOrders = orders;

    const allPaid = await prisma.order.findMany({
      where: { paymentStatus: 'PAID' },
      select: { total: true },
    });
    paidOrders = allPaid.length;
    totalRevenue = allPaid.reduce((sum, o) => sum + o.total, 0);
  } catch (e) {
    console.warn('Prisma admin query fallback:', e);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Store Overview</h1>
        <p className="text-xs text-zinc-400 mt-1">Live metrics and recent store transactions</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass p-6 border border-white/8 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Settled Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-price text-3xl font-black">${totalRevenue.toFixed(2)}</p>
          <span className="text-[11px] text-zinc-500 block">From {paidOrders} confirmed payments</span>
        </div>

        <div className="glass p-6 border border-white/8 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-white">{orderCount}</p>
          <span className="text-[11px] text-zinc-500 block">All orders created</span>
        </div>

        <div className="glass p-6 border border-white/8 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Settlement Rate</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white">
            {orderCount > 0 ? `${Math.round((paidOrders / orderCount) * 100)}%` : '0%'}
          </p>
          <span className="text-[11px] text-zinc-500 block">Payment conversion rate</span>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="glass p-6 border border-white/8 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/8 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Orders</h3>
          <Link href="/admin/orders" className="text-xs text-indigo-400 hover:text-indigo-300">
            View All Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-zinc-500 py-6 text-center">No orders have been placed yet.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/6 rounded-xl text-xs">
                <div>
                  <span className="font-mono font-bold text-white block">{ord.orderNumber}</span>
                  <span className="text-zinc-500">{ord.guestEmail || ord.guestContact || 'Guest'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                    ord.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {ord.paymentStatus}
                  </span>
                  <span className="text-price font-bold">${ord.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
