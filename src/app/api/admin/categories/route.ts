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
    const { name, slug, description, imageUrl, orderIndex } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Missing category name or slug' }, { status: 400 });
    }

    // Check if slug is unique
    const existing = await prisma.category.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        orderIndex: Number(orderIndex || 0),
        isEnabled: true,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Category POST error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
