'use client';

import React, { useState } from 'react';
import { Search, Mail, Phone, ShoppingBag, MapPin, Calendar, ExternalLink, MessageCircle, X, Eye } from 'lucide-react';
import Link from 'next/link';

export interface CustomerOrderSummary {
  id: string;
  orderNumber: string;
  grandTotal: number;
  status: string;
  createdAt: string;
}

export interface CustomerAddressSummary {
  id: string;
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  role: string;
  isActive: boolean;
  addresses: CustomerAddressSummary[];
  orders: CustomerOrderSummary[];
  totalOrders: number;
  totalSpent: number;
}

interface CustomerListTableProps {
  customers: CustomerItem[];
}

export default function CustomerListTable({ customers }: CustomerListTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  // Filter customers by name, email, or phone
  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white border border-gray-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-border rounded-xl pl-10 pr-4 py-2 text-xs bg-white text-dark focus:outline-none focus:border-primary font-medium"
          />
        </div>
        <div className="text-xs text-gray-text font-semibold shrink-0">
          Showing <span className="font-extrabold text-dark">{filteredCustomers.length}</span> of <span className="font-extrabold text-dark">{customers.length}</span> registered customers
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white border border-gray-border rounded-2xl shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-2">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <Search size={24} />
            </div>
            <p className="text-sm font-bold text-dark">No customers found matching &quot;{searchTerm}&quot;</p>
            <p className="text-xs text-gray-text">Try searching for a different name, email, or mobile number.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-border text-[10px] uppercase font-bold text-gray-text tracking-wider">
                <tr>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4">Orders & Spend</th>
                  <th className="px-6 py-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredCustomers.map((customer) => {
                  const initial = customer.name.charAt(0).toUpperCase() || 'C';
                  const cleanPhone = customer.phone.replace(/[^0-9]/g, '');

                  return (
                    <tr key={customer.id} className="hover:bg-bg-light/60 transition-colors">
                      {/* Name & Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary font-black flex items-center justify-center text-sm shrink-0 shadow-xs">
                            {initial}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-dark text-sm">{customer.name}</span>
                              {customer.role !== 'CUSTOMER' && (
                                <span className="bg-primary/10 text-primary text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {customer.role.replace('_', ' ')}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-text font-bold block mt-0.5">
                              ID: {customer.id.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-dark font-semibold">
                          <Mail size={13} className="text-gray-400 shrink-0" />
                          <a href={`mailto:${customer.email}`} className="hover:text-primary hover:underline truncate max-w-[180px]">
                            {customer.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-text">
                          <Phone size={13} className="text-gray-400 shrink-0" />
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-600 hover:underline font-mono"
                          >
                            {customer.phone}
                          </a>
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="px-6 py-4 text-gray-text font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-gray-400 shrink-0" />
                          <span>{new Date(customer.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                      </td>

                      {/* Orders & Total Spend */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-block bg-primary/10 text-primary font-black px-2 py-0.5 rounded-md text-[10px]">
                              {customer.totalOrders} {customer.totalOrders === 1 ? 'Order' : 'Orders'}
                            </span>
                          </div>
                          <span className="text-dark font-extrabold block text-xs">
                            Rs. {customer.totalSpent.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle size={15} />
                          </a>

                          <button
                            type="button"
                            onClick={() => setSelectedCustomer(customer)}
                            className="px-3 py-1.5 bg-white border border-gray-border hover:border-primary text-dark hover:text-primary rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <Eye size={14} /> Profile & Orders
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-gray-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-dark transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6 pr-8">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                {selectedCustomer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-dark tracking-tight">{selectedCustomer.name}</h3>
                  <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedCustomer.role.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-text font-semibold mt-0.5">
                  Registered Customer since {new Date(selectedCustomer.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-bg-light border border-gray-border rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Total Orders</span>
                <span className="text-lg font-black text-primary">{selectedCustomer.totalOrders}</span>
              </div>
              <div className="bg-bg-light border border-gray-border rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Total Expenditure</span>
                <span className="text-lg font-black text-dark">
                  Rs. {selectedCustomer.totalSpent.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-bg-light border border-gray-border rounded-xl p-4 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-gray-text uppercase tracking-wider block">Customer Phone</span>
                <span className="text-xs font-extrabold text-dark block font-mono truncate">{selectedCustomer.phone}</span>
              </div>
            </div>

            {/* Contact details & Actions */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-950">Direct Contact & Communications</p>
                <p className="text-[11px] text-emerald-700 font-medium">Click below to send order updates or WhatsApp messages directly to this customer.</p>
              </div>
              <a
                href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs shrink-0 transition-all"
              >
                <MessageCircle size={15} /> WhatsApp Customer
              </a>
            </div>

            {/* Delivery Addresses */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-dark uppercase tracking-widest flex items-center gap-1.5">
                <MapPin size={15} className="text-primary" /> Saved Delivery Addresses ({selectedCustomer.addresses.length})
              </h4>

              {selectedCustomer.addresses.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center text-xs text-gray-text">
                  No saved delivery addresses yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCustomer.addresses.map((addr) => (
                    <div key={addr.id} className="bg-white border border-gray-border rounded-xl p-3.5 text-xs space-y-1 relative">
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 bg-primary/10 text-primary text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          DEFAULT
                        </span>
                      )}
                      <p className="font-bold text-dark">{addr.name}</p>
                      <p className="text-gray-text leading-tight">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                      <p className="text-gray-text">{addr.city}, {addr.district} - {addr.postalCode}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-dark uppercase tracking-widest flex items-center gap-1.5">
                <ShoppingBag size={15} className="text-primary" /> Recent Orders History
              </h4>

              {selectedCustomer.orders.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-xs text-gray-text">
                  This customer has not placed any orders yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedCustomer.orders.map((ord) => (
                    <div key={ord.id} className="bg-white border border-gray-border rounded-xl p-3.5 flex justify-between items-center text-xs hover:border-primary/40 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/orders/${ord.id}`} className="font-black text-primary hover:underline">
                            {ord.orderNumber}
                          </Link>
                          <span className="bg-gray-100 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {ord.status.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-text block mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-dark block">
                          Rs. {ord.grandTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                        </span>
                        <Link href={`/admin/orders/${ord.id}`} className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-0.5">
                          View Order <ExternalLink size={10} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-dark text-white rounded-xl font-bold text-xs hover:bg-gray-800 transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
