import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, FolderKanban, ClipboardList, Settings, LogOut, UserCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Route Guard: restrict to staff roles
  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
  }

  const staffLinks = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders List', href: '/admin/orders', icon: ClipboardList },
    { label: 'Products', href: '/admin/products', icon: ShoppingBag },
    { label: 'Categories', href: '/admin/categories', icon: FolderKanban },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg-light flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-dark text-white shrink-0 flex flex-col justify-between border-r border-gray-800">
        <div className="p-6">
          <div className="flex flex-col mb-8">
            <span className="font-extrabold text-xl tracking-tight text-white">
              <span className="text-primary font-black">C.I.</span> Tech Admin
            </span>
            <span className="text-[9px] text-gray-text font-bold uppercase tracking-widest mt-0.5">
              MANAGEMENT PORTAL
            </span>
          </div>

          <div className="mb-4 bg-soft-dark border border-gray-800 p-3 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {session.name.substring(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-none">{session.name}</p>
              <p className="text-[9px] text-gray-text font-semibold uppercase mt-1 leading-none">{session.role.replace('_', ' ')}</p>
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
