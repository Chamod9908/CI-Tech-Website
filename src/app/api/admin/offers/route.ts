import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const settingsRecords = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            'offers_hero_bg_image',
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

    const settingsMap: Record<string, string> = {};
    settingsRecords.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({
      success: true,
      settings: settingsMap,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch offer settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'MANAGER']);
    const body = await req.json();

    const {
      offers_hero_bg_image,
      offers_hero_badge,
      offers_hero_title,
      offers_hero_desc,
      offers_promo_code,
      offers_promo_discount,
      offers_bundles_json,
    } = body;

    const updates = [
      { key: 'offers_hero_bg_image', value: offers_hero_bg_image ?? '' },
      { key: 'offers_hero_badge', value: offers_hero_badge ?? '' },
      { key: 'offers_hero_title', value: offers_hero_title ?? '' },
      { key: 'offers_hero_desc', value: offers_hero_desc ?? '' },
      { key: 'offers_promo_code', value: offers_promo_code ?? '' },
      { key: 'offers_promo_discount', value: offers_promo_discount ?? '' },
      { key: 'offers_bundles_json', value: typeof offers_bundles_json === 'string' ? offers_bundles_json : JSON.stringify(offers_bundles_json || []) },
    ];

    for (const item of updates) {
      if (item.value !== undefined) {
        await prisma.siteSetting.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Offers settings updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update offer settings' }, { status: 500 });
  }
}
