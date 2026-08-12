import React from 'react';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import OffersManager, { BundleDeal } from '@/components/admin/OffersManager';

export const revalidate = 0;

export default async function AdminOffersPage() {
  const session = await getSession();
  const isSuperAdmin = session?.role === 'SUPER_ADMIN' || session?.role === 'ADMIN';

  // Query all site settings for offers
  const settingsRecords = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          'offers_hero_badge',
          'offers_hero_title',
          'offers_hero_desc',
          'offers_promo_code',
          'offers_promo_discount',
          'offers_bundles_json',
        ],
      },
    },
  });

  const settings: Record<string, string> = {};
  settingsRecords.forEach((s) => {
    settings[s.key] = s.value;
  });

  // Default bundles fallback if not saved in DB yet
  const defaultBundles: BundleDeal[] = [
    {
      id: 'bundle-1',
      badge: 'SAVE 20%',
      badgeColor: 'emerald',
      title: 'Wall Framing Combo Pack',
      desc: 'Includes 1 Large Canvas Frame (12x18) + 2 Desk Photo Frames (6x8) with anti-glare lamination.',
      originalPrice: 4500,
      salePrice: 3600,
      isHidden: false,
      linkUrl: '/shop',
    },
    {
      id: 'bundle-2',
      badge: 'POPULAR DEAL',
      badgeColor: 'primary',
      title: 'Custom Gift Mug Duo',
      desc: 'Order 2 Personalized Photo Mugs with HD color correction & premium gift box packaging.',
      originalPrice: 1900,
      salePrice: 1580,
      isHidden: false,
      linkUrl: '/shop',
    },
    {
      id: 'bundle-3',
      badge: 'HOT OFFER',
      badgeColor: 'red',
      title: 'Wedding Memory Album Suite',
      desc: 'Premium Glossy Photo Album Book (40 pages) + 1 Free Synthetic Wooden Table Plaque.',
      originalPrice: 10300,
      salePrice: 8200,
      isHidden: false,
      linkUrl: '/shop',
    },
  ];

  let initialBundles: BundleDeal[] = defaultBundles;
  if (settings.offers_bundles_json) {
    try {
      initialBundles = JSON.parse(settings.offers_bundles_json);
    } catch {
      initialBundles = defaultBundles;
    }
  }

  return (
    <OffersManager
      initialSettings={settings}
      initialBundles={initialBundles}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
