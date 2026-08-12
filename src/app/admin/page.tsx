import React from 'react';
import { prisma } from '@/lib/db';
import { ShoppingCart, DollarSign, AlertTriangle, Users, FileText, ArrowRight, PackageOpen } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminDashboardIndex() {
  // 1. Fetch live metrics
  const ordersCount = await prisma.order.count();
  const salesAggregate = await prisma.order.aggregate({
    _sum: {
      grandTotal: true,
    },
  });
  const totalSales = Number(salesAggregate._sum.grandTotal || 0);

  const pendingOrders = await prisma.order.count({
    where: {
      NOT: {
        status: 'DELIVERED',
      },
    },
  });

  const products = await prisma.product.findMany();
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const lowStockCount = lowStockProducts.length;

  const customersCount = await prisma.customer.count();
  const productsCount = products.length;

  // 2. Fetch 5 Recent Orders
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="space-y-8">
      {/* Header Block */}
      <div>
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Business Overview</h1>
        <p className="text-xs sm:text-sm text-gray-text mt-1">
          Real-time metrics, printing pipeline queues, and stock levels from #colorlab99.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sales */}
        <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-text font-bold uppercase tracking-wider block">Total Sales</span>
            <span className="text-xl font-black text-dark">
              Rs. {totalSales.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-primary/10 text-primary p-3 rounded-full">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-text font-bold uppercase tracking-wider block">Total Orders</span>
            <span className="text-xl font-black text-dark">{ordersCount}</span>
          </div>
          <div className="bg-primary/10 text-primary p-3 rounded-full">
            <ShoppingCart size={20} />
          </div>
        </div>

        {/* Pending Queue */}
        <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-text font-bold uppercase tracking-wider block">Active Queue</span>
            <span className="text-xl font-black text-primary">{pendingOrders} pending</span>
          </div>
          <div className="bg-primary/10 text-primary p-3 rounded-full">
            <FileText size={20} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-text font-bold uppercase tracking-wider block">Stock Alerts</span>
            <span className={`text-xl font-black ${lowStockCount > 0 ? 'text-accent-red' : 'text-dark'}`}>
              {lowStockCount} items low
            </span>
          </div>
          <div className={`p-3 rounded-full ${lowStockCount > 0 ? 'bg-red-100 text-accent-red' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Orders List */}
        <div className="lg:col-span-2 bg-white border border-gray-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h3 className="text-sm font-extrabold text-dark uppercase tracking-widest">Active Printing Orders</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-0.5">
              Manage Orders <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-text">
              No orders registered yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-bg-light transition-colors"
                >
                  <div className="space-y-1">
                    <Link href={`/admin/orders/${ord.id}`} className="text-sm font-black text-primary hover:underline">
                      {ord.orderNumber}
                    </Link>
                    <p className="text-[10px] text-gray-text font-bold">
                      Customer: {ord.customerName} | Phone: {ord.customerPhone}
                    </p>
                  </div>
                  
                  <div className="flex gap-4 items-center justify-between sm:justify-start">
                    <span className="text-xs font-bold text-dark shrink-0">
                      Rs. {Number(ord.grandTotal).toLocaleString('en-LK', { minimumFractionDigits: 0 })}
                    </span>
                    <span className="inline-block bg-primary/10 text-primary text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Low Stock warnings and stats */}
        <div className="space-y-6">
          {/* Low Stock card list */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <AlertTriangle size={16} className="text-accent-red" /> Low Inventory Alerts
            </h3>
            
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-text">
                All products are fully stocked.
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-xs font-medium border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-extrabold text-dark truncate">{p.name}</p>
                      <p className="text-[9px] text-gray-text font-bold">SKU: {p.sku}</p>
                    </div>
                    <span className="bg-red-50 text-accent-red text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-red-100">
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick stats info card */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-2">Business Assets</h3>
            <div className="space-y-2 text-xs font-semibold text-gray-text">
              <div className="flex justify-between">
                <span>Unique Category Pipelines:</span>
                <span className="text-dark font-extrabold">{productsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Registered Customers:</span>
                <span className="text-dark font-extrabold">{customersCount}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
