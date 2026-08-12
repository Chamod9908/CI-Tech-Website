import React from 'react';
import { prisma } from '@/lib/db';
import { ClipboardList, Search, Eye } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import OrderFilterSelect from '@/components/admin/OrderFilterSelect';

export const revalidate = 0;

interface AdminOrdersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || '';

  // 1. Build Query Where Clause
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { customerName: { contains: search } },
      { customerPhone: { contains: search } },
    ];
  }

  if (status) {
    where.status = status;
  }

  // 2. Query Orders
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  const statuses = [
    'NEW_ORDER',
    'CONFIRMED',
    'DESIGNING',
    'DESIGN_APPROVED',
    'PRINTING',
    'QUALITY_CHECK',
    'READY',
    'DISPATCHED',
    'DELIVERED',
    'CANCELLED',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Order Management</h1>
          <p className="text-xs sm:text-sm text-gray-text mt-1">
            Track customer print files, assign staff to workflows, print invoices, and update status timelines.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-gray-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <form action="/admin/orders" method="GET" className="flex gap-2 w-full md:w-96">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search Order Number or Customer name..."
            className="w-full border border-gray-border rounded-lg px-3 py-1.5 text-xs bg-white text-dark focus:outline-none focus:border-primary placeholder-gray-400"
          />
          <Button type="submit" variant="primary" size="sm" className="px-4">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider shrink-0">Filter status:</span>
          <OrderFilterSelect currentStatus={status} statuses={statuses} />
        </div>
      </div>

      {/* Orders Grid/Table */}
      <div className="bg-white border border-gray-border rounded-xl overflow-hidden shadow-xs">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-xs text-gray-text">
            No orders match your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-bg-light border-b border-gray-border text-gray-text uppercase font-bold tracking-wider">
                  <th className="p-4">Reference</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Grand Total</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-dark">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-bg-light/40 transition-colors">
                    <td className="p-4 font-extrabold text-primary">
                      <Link href={`/admin/orders/${ord.id}`} className="hover:underline">
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-text">
                      {new Date(ord.createdAt).toLocaleDateString('en-LK')}
                    </td>
                    <td className="p-4">
                      <p className="font-extrabold">{ord.customerName}</p>
                      <p className="text-[10px] text-gray-text font-bold mt-0.5">{ord.customerPhone}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold">{ord.paymentMethod}</p>
                      <p className="text-[9px] text-gray-text font-bold uppercase tracking-wider mt-0.5">{ord.deliveryMethod}</p>
                    </td>
                    <td className="p-4 font-black">
                      Rs. {Number(ord.grandTotal).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block bg-primary/10 text-primary text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Link href={`/admin/orders/${ord.id}`}>
                        <Button size="sm" variant="outline" className="text-[10px] py-1 px-2.5 font-bold gap-1 mx-auto">
                          <Eye size={12} /> Manage
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
