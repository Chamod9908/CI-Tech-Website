import React from 'react';
import { getSession, destroySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { User, Package, Heart, LogOut, MapPin, Phone, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';

export const revalidate = 0;

export default async function AccountPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  // Fetch Customer Profile details
  const customer = await prisma.customer.findFirst({
    where: { userId: session.userId },
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 3,
      },
    },
  });

  if (!customer) {
    // Edge case: logged in but profile missing, create one
    redirect('/login');
  }

  const defaultAddress = customer.addresses.find(a => a.isDefault) || customer.addresses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Account Navigation */}
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
            <Link href="/account" className="bg-primary/10 text-primary px-3 py-2 rounded-lg flex items-center gap-2">
              <User size={16} /> Profile Dashboard
            </Link>
            <Link href="/account/orders" className="text-dark hover:bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 transition-all">
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

        {/* Right Dashboard panel */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Header block */}
          <div>
            <h1 className="text-3xl font-extrabold text-dark tracking-tight">Customer Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-text mt-1">
              Welcome back, {customer.name}. Check your order queues, edit delivery addresses, and view design previews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Profile summary details */}
            <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-2">Profile Information</h3>
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-gray-text">Email Address:</span>
                  <span className="text-dark truncate">{customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-text">Mobile Number:</span>
                  <span className="text-dark">{customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-text">Member Since:</span>
                  <span className="text-dark flex items-center gap-1">
                    <Calendar size={12} /> {new Date(customer.createdAt).toLocaleDateString('en-LK')}
                  </span>
                </div>
              </div>
            </div>

            {/* Saved Address details */}
            <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-2">Primary Address</h3>
              {defaultAddress ? (
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                    <div className="text-dark leading-relaxed">
                      <p className="font-bold">{defaultAddress.name}</p>
                      <p className="text-gray-text mt-1">{defaultAddress.line1}</p>
                      {defaultAddress.line2 && <p className="text-gray-text">{defaultAddress.line2}</p>}
                      <p className="text-gray-text">{defaultAddress.city}, {defaultAddress.district}</p>
                      <p className="text-[10px] text-primary mt-1 uppercase tracking-wider font-bold">Postal Code: {defaultAddress.postalCode}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-gray-text space-y-2">
                  <p>No addresses saved yet.</p>
                  <Button size="sm" variant="outline">Add Address</Button>
                </div>
              )}
            </div>

          </div>

          {/* Recent Orders List */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="text-sm font-extrabold text-dark uppercase tracking-widest">Recent Orders</h3>
              <Link href="/account/orders" className="text-xs font-bold text-primary hover:text-primary-hover">
                View All
              </Link>
            </div>

            {customer.orders.length === 0 ? (
              <div className="text-center py-10 text-xs text-gray-text">
                <p>You have not placed any orders yet.</p>
                <Link href="/shop" className="inline-block mt-3">
                  <Button variant="outline" size="sm">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {customer.orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-bg-light transition-colors"
                  >
                    <div>
                      <p className="text-xs text-gray-text font-bold uppercase tracking-wider">Reference Code</p>
                      <Link href={`/tracking?orderNumber=${ord.orderNumber}`} className="text-sm font-black text-primary hover:underline">
                        {ord.orderNumber}
                      </Link>
                      <p className="text-[10px] text-gray-text font-medium mt-1">
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-LK')}
                      </p>
                    </div>
                    
                    <div className="flex gap-6 justify-between sm:justify-start items-center">
                      <div>
                        <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider block">Grand Total</span>
                        <span className="text-xs font-bold text-dark">
                          Rs. {Number(ord.grandTotal).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider block">Status</span>
                        <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-0.5">
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>

                      <Link href={`/tracking?orderNumber=${ord.orderNumber}`}>
                        <Button size="sm" variant="outline" className="text-xs px-3">
                          Track Details
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
    </div>
  );
}
