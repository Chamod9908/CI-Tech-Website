import React from 'react';
import { siteSettings } from '@/data/settings';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const settings = siteSettings;
  const plainZones = [
    { name: 'Colombo', deliveryFee: 350.00, estimatedDays: '1-2 Days' },
    { name: 'Gampaha', deliveryFee: 400.00, estimatedDays: '2-3 Days' },
    { name: 'Kalutara', deliveryFee: 450.00, estimatedDays: '2-3 Days' },
    { name: 'Kandy', deliveryFee: 500.00, estimatedDays: '3-4 Days' },
    { name: 'Kurunegala', deliveryFee: 500.00, estimatedDays: '3-4 Days' },
    { name: 'Galle', deliveryFee: 500.00, estimatedDays: '3-4 Days' },
    { name: 'Matara', deliveryFee: 550.00, estimatedDays: '3-4 Days' },
    { name: 'Other Districts', deliveryFee: 600.00, estimatedDays: '4-5 Days' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-text hover:text-primary uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={16} /> Return to Cart Overview
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Complete Your Order</h1>
          <p className="text-xs sm:text-sm text-gray-text mt-1">
            Specify shipping coordinates, select payment methods, and confirm print specifications.
          </p>
        </div>

        <CheckoutForm
          session={null}
          settings={settings as unknown as Record<string, string>}
          zones={plainZones}
        />
      </div>
    </div>
  );
}
