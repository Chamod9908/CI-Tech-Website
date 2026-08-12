'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageSquare, ChevronRight, HelpCircle, Truck, Package } from 'lucide-react';

interface FooterProps {
  settings: Record<string, string>;
}

export default function Footer({ settings }: FooterProps) {
  const brandName = settings.site_name || 'C.I. Technologies & Color Lab';
  const hashtag = settings.brand_hashtag || '#colorlab99';
  const address = settings.store_address || '99 Main Street, Colombo, Sri Lanka';
  const phone = settings.contact_phone || '+94 77 123 4567';
  const email = settings.contact_email || 'info@colorlab99.lk';
  const hours = settings.opening_hours || 'Monday - Saturday: 8.30 AM - 7.00 PM';
  const whatsappNumber = settings.contact_whatsapp || '+94771234567';

  // Social Links placeholders
  const socialLinks = [
    { label: 'Facebook', href: settings.social_facebook || '#' },
    { label: 'Instagram', href: settings.social_instagram || '#' },
    { label: 'TikTok', href: settings.social_tiktok || '#' },
  ];

  return (
    <footer className="bg-dark text-white border-t-4 border-primary mt-auto">
      {/* Upper Footer: Core Value Props */}
      <div className="border-b border-soft-dark py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-primary p-3 rounded-full text-white">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Islandwide Delivery</h4>
              <p className="text-xs text-gray-text mt-0.5">Reliable shipping across Sri Lanka</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-primary p-3 rounded-full text-white">
              <Package size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Premium Quality</h4>
              <p className="text-xs text-gray-text mt-0.5">Vivid prints, solid wood frames, and matte glass</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-primary p-3 rounded-full text-white">
              <HelpCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Direct Support</h4>
              <p className="text-xs text-gray-text mt-0.5">Chat with our print specialists on WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer: Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand details */}
        <div className="space-y-4">
          <h3 className="text-lg font-black tracking-tight text-white">
            <span className="text-primary">C.I.</span> Technologies
          </h3>
          <p className="text-xs text-gray-text leading-relaxed">
            Professional photo printing, studio lab services, customized mugs, canvas prints, and business branding. Preserving your memories with precision.
          </p>
          <div className="pt-2">
            <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {hashtag}
            </span>
          </div>
        </div>

        {/* Categories / Quick Links */}
        <div>
          <h4 className="text-sm font-extrabold text-white tracking-widest uppercase border-l-2 border-primary pl-2 mb-4">
            Our Services
          </h4>
          <ul className="space-y-2 text-xs text-gray-text">
            <li>
              <Link href="/shop?category=photo-printing" className="hover:text-primary transition-colors flex items-center gap-1">
                <ChevronRight size={12} /> Photo Lab Printing
              </Link>
            </li>
            <li>
              <Link href="/shop?category=photo-frames" className="hover:text-primary transition-colors flex items-center gap-1">
                <ChevronRight size={12} /> Custom Photo Frames
              </Link>
            </li>
            <li>
              <Link href="/shop?category=mug-printing" className="hover:text-primary transition-colors flex items-center gap-1">
                <ChevronRight size={12} /> Personalized Mugs
              </Link>
            </li>
            <li>
              <Link href="/shop?category=personalized-gifts" className="hover:text-primary transition-colors flex items-center gap-1">
                <ChevronRight size={12} /> Personalized Gifts
              </Link>
            </li>
            <li>
              <Link href="/shop?category=business-printing" className="hover:text-primary transition-colors flex items-center gap-1">
                <ChevronRight size={12} /> Business Printing
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-sm font-extrabold text-white tracking-widest uppercase border-l-2 border-primary pl-2 mb-4">
            Customer Support
          </h4>
          <ul className="space-y-2 text-xs text-gray-text">
            <li>
              <Link href="/tracking" className="hover:text-primary transition-colors flex items-center gap-1">
                <ChevronRight size={12} /> Track Order Status
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-1">
                <ChevronRight size={12} /> Store Location & Hours
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-primary transition-colors flex items-center gap-1">
                <ChevronRight size={12} /> Frequently Asked Questions
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary transition-colors flex items-center gap-1">
                <ChevronRight size={12} /> About #colorlab99
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact details */}
        <div className="space-y-3 text-xs text-gray-text">
          <h4 className="text-sm font-extrabold text-white tracking-widest uppercase border-l-2 border-primary pl-2 mb-4">
            Contact Us
          </h4>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
            <span>{address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-primary shrink-0" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-primary shrink-0" />
            <span className="truncate">{email}</span>
          </div>
          <div className="pt-2">
            <p className="text-[10px] text-gray-text font-bold uppercase tracking-wider">Opening Hours</p>
            <p className="mt-0.5 text-[11px] font-semibold text-white">{hours}</p>
          </div>
        </div>

      </div>

      {/* Lower Footer: Socials + Legal */}
      <div className="bg-soft-dark py-6 text-xs text-gray-text border-t border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            &copy; {new Date().getFullYear()} <span className="text-white font-semibold">{brandName}</span>. All rights reserved.
          </div>
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {social.label}
              </a>
            ))}
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-white transition-colors font-semibold flex items-center gap-1"
            >
              <MessageSquare size={14} /> WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
