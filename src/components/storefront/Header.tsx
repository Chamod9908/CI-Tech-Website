'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown, LogOut, Edit } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SessionPayload } from '@/lib/auth';

interface HeaderProps {
  session: SessionPayload | null;
  announcement: string;
  settings: Record<string, string>;
}

export default function Header({ session, announcement, settings }: HeaderProps) {
  const isSuperAdmin = session?.role === 'SUPER_ADMIN';
  const pathname = usePathname();
  const { cartCount, wishlist } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const brandName = settings.site_name || 'C.I. Technologies & Color Lab';
  const hashtag = settings.brand_hashtag || '#colorlab99';
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);


  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Offers', href: '/offers' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-white border-b border-gray-border shadow-xs">
      {/* Announcement Bar */}
      {announcement && (
        <div className="w-full text-white text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--color-announcement)' }}>
          <span>{announcement}</span>
          {isSuperAdmin && (
            <Link href="/admin/settings" className="bg-white/20 hover:bg-white/30 text-white rounded p-0.5 transition-all inline-flex items-center justify-center shrink-0" title="Edit Announcement Bar (Super Admin)">
              <Edit size={10} />
            </Link>
          )}
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-dark focus:outline-none hover:text-primary transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo & Hashtag */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 select-none">
            {settings.logo_image_url && (
              <img
                src={settings.logo_image_url}
                alt={`${brandName} Logo`}
                className="h-10 w-auto object-contain shrink-0"
              />
            )}
            <div className="flex flex-col items-start">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-dark flex items-center gap-1">
                {brandName.startsWith('C.I. ') ? (
                  <>
                    <span className="text-primary font-black">C.I.</span> {brandName.substring(5)}
                  </>
                ) : (
                  brandName
                )}
              </span>
              <span className="text-[10px] text-primary font-extrabold tracking-widest leading-none mt-1">
                {hashtag}
              </span>
            </div>
          </Link>
          {isSuperAdmin && (
            <Link href="/admin/settings" className="text-gray-text hover:text-primary transition-all p-1 inline-flex items-center justify-center shrink-0" title="Edit Branding Settings (Super Admin)">
              <Edit size={12} />
            </Link>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold text-sm transition-colors relative py-1 ${
                  isActive
                    ? 'text-primary'
                    : 'text-dark hover:text-primary'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Desktop Search Toggle */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-dark hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-all focus:outline-none"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            {searchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 top-12 w-72 bg-white p-3 rounded-lg border border-gray-border shadow-lg flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border border-gray-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                >
                  Go
                </button>
              </form>
            )}
          </div>

          {/* Wishlist Icon */}
          <Link
            href="/account/wishlist"
            className="text-dark hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-all relative"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-red text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="text-dark hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-all relative"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account Icon / Dropdown */}
          <div className="relative">
            {session ? (
              <div className="flex items-center">
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-1 text-sm font-semibold text-dark hover:text-primary transition-colors focus:outline-none p-1"
                >
                  <User size={20} className="text-primary" />
                  <span className="hidden lg:inline max-w-28 truncate">{session.name}</span>
                  <ChevronDown size={14} />
                </button>

                {accountDropdownOpen && (
                  <div className="absolute right-0 top-10 w-48 bg-white border border-gray-border rounded-lg shadow-lg py-2">
                    <div className="px-4 py-2 border-b border-gray-border">
                      <p className="text-xs text-gray-text font-semibold">Logged in as</p>
                      <p className="text-sm font-bold text-dark truncate">{session.name}</p>
                    </div>
                    {session.role !== 'CUSTOMER' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-dark hover:bg-gray-100 font-semibold"
                        onClick={() => setAccountDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-dark hover:bg-gray-100 font-semibold"
                      onClick={() => setAccountDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-2 text-sm text-dark hover:bg-gray-100 font-semibold"
                      onClick={() => setAccountDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={async () => {
                        setAccountDropdownOpen(false);
                        const res = await fetch('/api/auth/logout', { method: 'POST' });
                        if (res.ok) {
                          window.location.href = '/login';
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-accent-red hover:bg-gray-100 font-semibold flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-dark hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-all flex items-center gap-1 font-semibold text-sm"
                aria-label="Login"
              >
                <User size={20} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-border px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-gray-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-1.5 rounded-md text-xs font-semibold"
            >
              Search
            </button>
          </form>

          <nav className="flex flex-col space-y-3 font-semibold text-sm text-dark">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 border-b border-gray-100 hover:text-primary ${
                  pathname === link.href ? 'text-primary' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
