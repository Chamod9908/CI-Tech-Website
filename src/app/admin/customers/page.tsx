import React from 'react';
import { prisma } from '@/lib/db';
import CustomerListTable, { CustomerItem } from '@/components/admin/CustomerListTable';
import { Users, ShoppingBag, DollarSign, UserCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AdminCustomersPage() {
  try {
    // 1. Query registered customers with relations
    const rawCustomers = await prisma.customer.findMany({
      include: {
        user: {
          select: {
            id: true,
            role: true,
            isActive: true,
          },
        },
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            grandTotal: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Format customer items with fallbacks
    const customers: CustomerItem[] = (rawCustomers || []).map((c) => {
      const orderList = c.orders || [];
      const totalSpent = orderList.reduce((sum, ord) => sum + Number(ord?.grandTotal || 0), 0);
      return {
        id: c.id,
        name: c.name || 'Customer',
        email: c.email || '',
        phone: c.phone || '',
        createdAt: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
        role: c.user?.role || 'CUSTOMER',
        isActive: c.user?.isActive ?? true,
        addresses: (c.addresses || []).map((a) => ({
          id: a.id,
          name: a.name || 'Address',
          line1: a.line1 || '',
          line2: a.line2,
          city: a.city || '',
          district: a.district || '',
          postalCode: a.postalCode || '',
          isDefault: Boolean(a.isDefault),
        })),
        orders: orderList.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber || 'CI-ORDER',
          grandTotal: Number(o.grandTotal || 0),
          status: o.status || 'NEW_ORDER',
          createdAt: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
        })),
        totalOrders: orderList.length,
        totalSpent,
      };
    });

    // 3. High-level customer stats
    const totalCustomers = customers.length;
    const repeatCustomers = customers.filter((c) => c.totalOrders > 1).length;
    const totalCustomerOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
    const totalCustomerRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

    return (
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Registered Customers Directory</h1>
          <p className="text-xs sm:text-sm text-gray-text mt-1">
            Manage registered customer profiles, contact info, delivery locations, and individual order history.
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Registered Customers */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-text font-bold uppercase tracking-wider block">Registered Users</span>
              <span className="text-2xl font-black text-dark">{totalCustomers}</span>
            </div>
            <div className="bg-primary/10 text-primary p-3.5 rounded-2xl">
              <Users size={22} />
            </div>
          </div>

          {/* Repeat / Loyal Customers */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-text font-bold uppercase tracking-wider block">Repeat Buyers</span>
              <span className="text-2xl font-black text-emerald-600">{repeatCustomers}</span>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-2xl border border-emerald-100">
              <UserCheck size={22} />
            </div>
          </div>

          {/* Total Orders by Customers */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-text font-bold uppercase tracking-wider block">Total Customer Orders</span>
              <span className="text-2xl font-black text-dark">{totalCustomerOrders}</span>
            </div>
            <div className="bg-primary/10 text-primary p-3.5 rounded-2xl">
              <ShoppingBag size={22} />
            </div>
          </div>

          {/* Total Revenue from Registered Accounts */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-text font-bold uppercase tracking-wider block">Total Account Revenue</span>
              <span className="text-xl font-black text-dark">
                Rs. {totalCustomerRevenue.toLocaleString('en-LK', { minimumFractionDigits: 0 })}
              </span>
            </div>
            <div className="bg-primary/10 text-primary p-3.5 rounded-2xl">
              <DollarSign size={22} />
            </div>
          </div>
        </div>

        {/* Main Customers Interactive Table & Detail Drawer */}
        <CustomerListTable customers={customers} />
      </div>
    );
  } catch (err: any) {
    console.error('Admin Customers Directory Error:', err);
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-accent-red space-y-2">
        <h2 className="text-lg font-bold">Customer Directory Error</h2>
        <p className="text-xs font-mono">{String(err?.message || err)}</p>
      </div>
    );
  }
}
