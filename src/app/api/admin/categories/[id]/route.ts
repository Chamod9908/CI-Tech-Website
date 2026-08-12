import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

// 1. PATCH: Update category (e.g. toggle isEnabled)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    // Guard: restrict to staff
    if (!session || session.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    
    const { isEnabled, name, orderIndex, description, imageUrl } = body;
    
    const updateData: { 
      isEnabled?: boolean; 
      name?: string; 
      orderIndex?: number;
      description?: string | null;
      imageUrl?: string | null;
    } = {};
    
    if (isEnabled !== undefined) updateData.isEnabled = !!isEnabled;
    if (name !== undefined) updateData.name = String(name);
    if (orderIndex !== undefined) updateData.orderIndex = Number(orderIndex);
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error('Category PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// 2. DELETE: Delete category
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    // Guard: restrict to staff
    if (!session || session.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 });
    }

    const { id } = await params;

    // Check if the category has mapped products
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      // If there are products, soft-disable the category instead of deleting to prevent breaking relations
      await prisma.category.update({
        where: { id },
        data: { isEnabled: false },
      });
      return NextResponse.json({ 
        success: true, 
        warning: 'Category has products mapped to it. It has been deactivated/hidden instead of deleted.' 
      });
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Category DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
