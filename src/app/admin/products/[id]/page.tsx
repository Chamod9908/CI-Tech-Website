import React from 'react';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import ProductEditForm from '@/components/admin/ProductEditForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

interface ProductEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const session = await getSession();

  // Guard: restrict to staff
  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
  }

  const resolvedParams = await params;
  const productId = resolvedParams.id;

  // Query product details
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: true,
      options: {
        include: {
          values: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch categories
  const categories = await prisma.category.findMany({
    where: { isEnabled: true },
    orderBy: { orderIndex: 'asc' },
  });

  // Map Decimal properties to numbers to avoid serialization crashes
  const plainProduct = {
    id: product.id,
    name: product.name,
    sku: product.sku,
    categoryId: product.categoryId,
    description: product.description,
    shortDescription: product.shortDescription,
    price: Number(product.price),
    costPrice: Number(product.costPrice),
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    imageUrl: product.images[0]?.url || '',
    options: product.options.map((opt) => ({
      name: opt.name,
      values: opt.values.map((v) => ({
        value: v.value,
        priceAdjustment: Number(v.priceAdjustment),
      })),
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-text hover:text-primary uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={16} /> Back to Catalog list
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Edit Product</h1>
        <p className="text-xs sm:text-sm text-gray-text mt-1">
          Modify the specifications, pricing structures, or customizable options for {product.name}.
        </p>
      </div>

      <ProductEditForm product={plainProduct} categories={categories} />
    </div>
  );
}
