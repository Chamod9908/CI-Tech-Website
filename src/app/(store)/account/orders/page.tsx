import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { User, Package, Heart, LogOut, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';

export const revalidate = 0;

export default async function AccountOrdersPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  // Fetch Customer Profile details
  const customer = await prisma.customer.findFirst({
    where: { userId: session.userId },
  });

  if (!customer) {
    redirect('/login');
  }

  // Fetch all orders
  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-1 bg-white border border-gray-border rounded-2xl p-6 shadow-xs space-y-6">
          <div className="text-center pb-4 border-b border-gray-100 space-y-2">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <User size={28} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-dark truncate">{customer.name}</h3>
              <p className="text-[10px] text-gray-text font-bold uppercase tracking-wider">{session.role}</p>
            </div>
          </div>

          <nav className="flex flex-col space-y-2 font-semibold text-sm">
            <Link href="/account" className="text-dark hover:bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 transition-all">
              <User size={16} /> Profile Dashboard
            </Link>
            <Link href="/account/orders" className="bg-primary/10 text-primary px-3 py-2 rounded-lg flex items-center gap-2">
              <Package size={16} /> My Orders
            </Link>
            <Link href="/account/wishlist" className="text-dark hover:bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 transition-all">
              <Heart size={16} /> Wishlist Catalog
            </Link>
            
            <form action="/api/auth/logout" method="POST" className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="w-full text-left text-accent-red hover:bg-red-50 px-3 py-2 rounded-lg flex items-center gap-2 transition-all font-bold"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </form>
          </nav>
        </div>

        {/* Right Orders List panel */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-dark tracking-tight">Order Purchase History</h1>
            <p className="text-xs sm:text-sm text-gray-text mt-1">
              View and track all print orders, frame selections, and customized layout packages.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-border rounded-2xl space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                <Package size={20} />
              </div>
              <p className="text-xs text-gray-text">You have not placed any orders yet.</p>
              <Link href="/shop" className="inline-block">
                <Button variant="primary">Shop Custom Prints</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white border border-gray-border rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-primary/50 transition-colors"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider block">Order Reference ID</span>
                    <Link href={`/tracking?orderNumber=${ord.orderNumber}`} className="text-lg font-black text-primary hover:underline">
                      {ord.orderNumber}
                    </Link>
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-text pt-1">
                      <span>Date: {new Date(ord.createdAt).toLocaleDateString('en-LK')}</span>
                      <span>Payment: <strong className="text-dark">{ord.paymentMethod}</strong></span>
                      <span>Delivery: <strong className="text-dark">{ord.deliveryMethod}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 justify-between">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider block">Invoice Amount</span>
                      <span className="text-base font-black text-dark">
                        Rs. {Number(ord.grandTotal).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider block">Workflow Status</span>
                      <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mt-1">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>

                    <Link href={`/tracking?orderNumber=${ord.orderNumber}`} className="w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs font-bold gap-1">
                        <FileText size={14} /> Full Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
