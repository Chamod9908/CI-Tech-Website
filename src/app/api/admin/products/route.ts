import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    // Guard: restrict to staff
    if (!session || session.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      sku,
      categoryId,
      description,
      shortDescription,
      price,
      costPrice,
      stock,
      lowStockThreshold,
      imageUrl,
      options, // Array of { name, values: Array of { value, priceAdjustment } }
    } = body;

    if (!name || !sku || !categoryId || !price || !costPrice) {
      return NextResponse.json({ error: 'Missing required product parameters' }, { status: 400 });
    }

    // Auto-generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    // Create product in a transaction
    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        categoryId,
        description,
        shortDescription,
        price: Number(price),
        costPrice: Number(costPrice),
        stock: Number(stock || 0),
        lowStockThreshold: Number(lowStockThreshold || 5),
        images: {
          create: imageUrl ? [{ url: imageUrl, orderIndex: 0 }] : [],
        },
        options: {
          create: (options as { name: string; values: { value: string; priceAdjustment: number }[] }[] || []).map((opt) => ({
            name: opt.name,
            isRequired: true,
            values: {
              create: (opt.values || []).map((val) => ({
                value: val.value,
                priceAdjustment: Number(val.priceAdjustment || 0),
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Product POST error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
