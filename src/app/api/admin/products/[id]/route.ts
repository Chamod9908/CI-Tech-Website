import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

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

    // Support quick toggle updates (like hide/visible)
    if (body.isActive !== undefined) {
      const updated = await prisma.product.update({
        where: { id },
        data: { isActive: !!body.isActive },
      });
      return NextResponse.json({ success: true, product: updated });
    }

    const {
      name,
      sku,
      categoryId,
      description,
      shortDescription,
      price,
      costPrice,
      salePrice,
      stock,
      lowStockThreshold,
      imageUrl,
      options, // Array of { name, values: Array of { value, priceAdjustment } }
    } = body;

    if (!name || !sku || !categoryId || price === undefined) {
      return NextResponse.json({ error: 'Missing required product parameters' }, { status: 400 });
    }

    // Update product transaction
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Update basic info
      const product = await tx.product.update({
        where: { id },
        data: {
          name,
          sku,
          categoryId,
          description,
          shortDescription,
          price: Number(price),
          costPrice: costPrice !== undefined && costPrice !== null ? Number(costPrice) : 0,
          salePrice: salePrice !== undefined && salePrice !== null && salePrice !== '' ? Number(salePrice) : null,
          stock: Number(stock || 0),
          lowStockThreshold: Number(lowStockThreshold || 5),
        },
      });

      // 2. Update Image (delete previous and recreate)
      await tx.productImage.deleteMany({
        where: { productId: id },
      });
      if (imageUrl) {
        await tx.productImage.create({
          data: {
            productId: id,
            url: imageUrl,
            orderIndex: 0,
          },
        });
      }

      // 3. Update Options (delete previous and recreate to prevent complex diffing conflicts)
      await tx.productOption.deleteMany({
        where: { productId: id },
      });

      if (options && options.length > 0) {
        for (const opt of options as { name: string; isRequired?: boolean; values: { value: string; priceAdjustment: number }[] }[]) {
          await tx.productOption.create({
            data: {
              productId: id,
              name: opt.name,
              isRequired: opt.isRequired !== undefined ? opt.isRequired : true,
              values: {
                create: opt.values.map((v) => ({
                  value: v.value,
                  priceAdjustment: Number(v.priceAdjustment || 0),
                })),
              },
            },
          });
        }
      }

      return product;
    }, {
      maxWait: 15000,
      timeout: 30000,
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Product PATCH error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Delete product safely
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

    // Check if the product has past order transactions to avoid foreign key errors
    const orderCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderCount > 0) {
      // Soft-disable the product instead of deleting it to protect past transaction records
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ 
        success: true, 
        warning: 'Product is mapped to order transactions. It has been deactivated/hidden instead of deleted.' 
      });
    }

    // Cascade delete relations and the product
    await prisma.$transaction(async (tx) => {
      // 1. Delete option values
      await tx.productOptionValue.deleteMany({
        where: { option: { productId: id } }
      });
      // 2. Delete options
      await tx.productOption.deleteMany({
        where: { productId: id }
      });
      // 3. Delete images
      await tx.productImage.deleteMany({
        where: { productId: id }
      });
      // 4. Delete cart items
      await tx.cartItem.deleteMany({
        where: { productId: id }
      });
      // 5. Delete inventory transactions
      await tx.inventoryTransaction.deleteMany({
        where: { productId: id }
      });
      // 6. Delete product
      await tx.product.delete({
        where: { id }
      });
    }, {
      maxWait: 15000,
      timeout: 30000,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
