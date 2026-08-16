import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, FolderKanban, ClipboardList, Settings, LogOut, UserCheck, Users, Tag, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await getSession();
  } catch (e) {
    console.error('Session fetch error in layout:', e);
  }

  // Route Guard: restrict to staff roles
  if (!session) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center p-6">
        <div className="bg-white border border-gray-border rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto font-black text-lg">
            CI
          </div>
          <h2 className="text-xl font-extrabold text-dark tracking-tight">Staff Authentication Required</h2>
          <p className="text-xs text-gray-text leading-relaxed">
            Please sign in with a Staff or Admin account to access the #colorlab99 management portal.
          </p>
          <Link href="/login" className="inline-block bg-primary hover:bg-primary-hover text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-xs">
            Sign In to Admin Account
          </Link>
        </div>
      </div>
    );
  }

  if (session.role === 'CUSTOMER') {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center p-6">
        <div className="bg-white border border-gray-border rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-red-100 text-accent-red flex items-center justify-center mx-auto font-black text-lg">
            !
          </div>
          <h2 className="text-xl font-extrabold text-dark tracking-tight">Access Restricted</h2>
          <p className="text-xs text-gray-text leading-relaxed">
            The Admin Management Portal is restricted to studio managers, designers, and staff employees.
          </p>
          <Link href="/account" className="inline-block bg-primary hover:bg-primary-hover text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-xs">
            Go to Your Customer Account
          </Link>
        </div>
      </div>
    );
  }

  const staffLinks = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders List', href: '/admin/orders', icon: ClipboardList },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Offers & Deals', href: '/admin/offers', icon: Tag },
    { label: 'Products', href: '/admin/products', icon: ShoppingBag },
    { label: 'Categories', href: '/admin/categories', icon: FolderKanban },
    { label: 'Audit Logs', href: '/admin/logs', icon: ShieldCheck },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg-light flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-dark text-white shrink-0 flex flex-col justify-between border-r border-gray-800">
        <div className="p-6">
          <div className="flex flex-col mb-8">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
              <span className="text-primary font-black">C.I.</span>
              <span className="text-white">Tech &amp;</span>
              <span className="text-primary font-black">Color</span>
              <span className="text-red-500 font-black">Lab</span>
            </span>
            <span className="text-[9px] text-primary font-bold uppercase tracking-widest mt-0.5">
              ADMIN PORTAL <span className="text-gray-400 font-normal lowercase tracking-normal">| Experience The Excellence</span>
            </span>
          </div>

          <div className="mb-4 bg-soft-dark border border-gray-800 p-3 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {(session.name || session.email || 'A').substring(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-none">{session.name || session.email || 'Admin'}</p>
              <p className="text-[9px] text-gray-text font-semibold uppercase mt-1 leading-none">{session.role ? session.role.replace('_', ' ') : 'STAFF'}</p>
            </div>
          </div>

          <nav className="flex flex-col space-y-1 pt-4 text-sm font-semibold">
            {staffLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-gray-text hover:text-white hover:bg-soft-dark transition-all"
                >
                  <Icon size={18} className="text-primary" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom panel */}
        <div className="p-6 border-t border-gray-800">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full text-left text-accent-red hover:bg-red-950/20 px-3.5 py-2.5 rounded-lg flex items-center gap-3 transition-all font-bold text-sm"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
