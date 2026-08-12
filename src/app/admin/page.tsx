import React from 'react';
import { prisma } from '@/lib/db';
import { ShoppingCart, DollarSign, AlertTriangle, Users, FileText, ArrowRight, FolderKanban, UserCheck, Eye } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminDashboardIndex() {
  try {
    // 1. Fetch live metrics
    const ordersCount = await prisma.order.count();
    const salesAggregate = await prisma.order.aggregate({
      _sum: {
        grandTotal: true,
      },
    });
    const totalSales = Number(salesAggregate?._sum?.grandTotal || 0);

    const pendingOrders = await prisma.order.count({
      where: {
        NOT: {
          status: 'DELIVERED',
        },
      },
    });

    const products = await prisma.product.findMany();
    const lowStockProducts = products.filter((p) => (p.stock ?? 0) <= (p.lowStockThreshold ?? 5));
    const lowStockCount = lowStockProducts.length;

    const customersCount = await prisma.customer.count();
    const categoriesCount = await prisma.category.count();
    const productsCount = products.length;

    // 2. Fetch 5 Recent Orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // 3. Fetch 5 Recent Registered Customers
    const recentCustomers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        orders: {
          select: { id: true, grandTotal: true },
        },
      },
    });

  return (
    <div className="space-y-8">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Business & Store Overview</h1>
          <p className="text-xs sm:text-sm text-gray-text mt-1">
            Real-time analytics, customer registrations, printing pipeline queues, and inventory levels.
          </p>
        </div>
        <Link
          href="/admin/customers"
          className="bg-primary hover:bg-primary-hover text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all shrink-0"
        >
          <Users size={16} /> View Customers ({customersCount})
        </Link>
      </div>

      {/* Top Metric KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Total Sales */}
        <div className="bg-white border border-gray-border rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider block">Total Sales</span>
            <span className="text-lg font-black text-dark block truncate">
              Rs. {totalSales.toLocaleString('en-LK', { minimumFractionDigits: 0 })}
            </span>
          </div>
          <div className="bg-primary/10 text-primary p-3 rounded-2xl shrink-0">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-gray-border rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider block">Total Orders</span>
            <span className="text-xl font-black text-dark">{ordersCount}</span>
          </div>
          <div className="bg-primary/10 text-primary p-3 rounded-2xl shrink-0">
            <ShoppingCart size={20} />
          </div>
        </div>

        {/* Active Queue */}
        <div className="bg-white border border-gray-border rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider block">Active Queue</span>
            <span className="text-xl font-black text-primary">{pendingOrders} pending</span>
          </div>
          <div className="bg-primary/10 text-primary p-3 rounded-2xl shrink-0">
            <FileText size={20} />
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-white border border-gray-border rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider block">Registered Customers</span>
            <span className="text-xl font-black text-dark">{customersCount}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl border border-emerald-100 shrink-0">
            <Users size={20} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-gray-border rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider block">Stock Alerts</span>
            <span className={`text-xl font-black ${lowStockCount > 0 ? 'text-accent-red' : 'text-dark'}`}>
              {lowStockCount} low
            </span>
          </div>
          <div className={`p-3 rounded-2xl shrink-0 ${lowStockCount > 0 ? 'bg-red-100 text-accent-red' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Orders List */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Orders List */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest">Active Printing Orders</h3>
              <Link href="/admin/orders" className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-0.5">
                Manage All Orders <ArrowRight size={14} />
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
                        Customer: {ord.customerName || 'Guest'} | Phone: {ord.customerPhone || 'N/A'}
                      </p>
                    </div>
                    
                    <div className="flex gap-4 items-center justify-between sm:justify-start">
                      <span className="text-xs font-bold text-dark shrink-0">
                        Rs. {Number(ord.grandTotal || 0).toLocaleString('en-LK', { minimumFractionDigits: 0 })}
                      </span>
                      <span className="inline-block bg-primary/10 text-primary text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                        {ord.status ? ord.status.replace('_', ' ') : 'PENDING'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Registered Customers Overview */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest flex items-center gap-1.5">
                <Users size={16} className="text-primary" /> Newly Registered Customers
              </h3>
              <Link href="/admin/customers" className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-0.5">
                View Customer Directory <ArrowRight size={14} />
              </Link>
            </div>

            {recentCustomers.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-text">
                No registered customers found.
              </div>
            ) : (
              <div className="space-y-3">
                {recentCustomers.map((cust) => {
                  const ordersList = cust.orders || [];
                  const spendSum = ordersList.reduce((sum, o) => sum + Number(o?.grandTotal || 0), 0);
                  const initial = (cust.name || 'C').charAt(0).toUpperCase();

                  return (
                    <div key={cust.id} className="flex justify-between items-center border border-gray-100 p-3 rounded-xl hover:bg-bg-light/60 transition-colors text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-dark truncate">{cust.name || 'Customer'}</p>
                          <p className="text-[10px] text-gray-text truncate">{cust.email || 'No email'} • {cust.phone || 'No phone'}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-full block">
                          {ordersList.length} Orders
                        </span>
                        <span className="text-[10px] font-bold text-dark block mt-0.5">
                          Rs. {spendSum.toLocaleString('en-LK', { minimumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Inventory & Business Metrics */}
        <div className="space-y-6">
          {/* Low Stock card list */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-1.5">
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

          {/* Business Assets summary */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-2">Business Assets Summary</h3>
            <div className="space-y-3 text-xs font-semibold text-gray-text">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><Users size={14} className="text-primary" /> Registered Customers:</span>
                <span className="text-dark font-extrabold">{customersCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><ShoppingCart size={14} className="text-primary" /> Catalog Products:</span>
                <span className="text-dark font-extrabold">{productsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><FolderKanban size={14} className="text-primary" /> Active Categories:</span>
                <span className="text-dark font-extrabold">{categoriesCount}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
  } catch (err: any) {
    console.error('Admin Dashboard Exception:', err);
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-accent-red space-y-2">
        <h2 className="text-lg font-bold">Admin Dashboard Error</h2>
        <p className="text-xs font-mono">{String(err?.message || err)}</p>
      </div>
    );
  }
}
