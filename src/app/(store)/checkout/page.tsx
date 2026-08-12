import React from 'react';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getAllSiteSettings } from '@/lib/settings';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function CheckoutPage() {
  const session = await getSession();
  const settings = await getAllSiteSettings();
  const zones = await prisma.deliveryZone.findMany({
    where: { isActive: true },
  });

  // Map to simple JSON representations for passing down cleanly
  const plainZones = zones.map(z => ({
    name: z.name,
    deliveryFee: Number(z.deliveryFee),
    estimatedDays: z.estimatedDays,
  }));

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
          session={session}
          settings={settings}
          zones={plainZones}
        />
      </div>
    </div>
  );
}
