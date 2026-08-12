import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProductConfigurator from '@/components/product/ProductConfigurator';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { getSession } from '@/lib/auth';

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const session = await getSession();
  const isSuperAdmin = session?.role === 'SUPER_ADMIN';

  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const product = await prisma.product.findUnique({
    where: { slug },
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

  const plainProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    shortDescription: product.shortDescription,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    images: product.images.map(img => ({ id: img.id, url: img.url })),
    options: product.options.map(opt => ({
      id: opt.id,
      name: opt.name,
      isRequired: opt.isRequired,
      values: opt.values.map(val => ({
        id: val.id,
        value: val.value,
        priceAdjustment: Number(val.priceAdjustment),
      })),
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button & Edit button */}
      <div className="mb-6 flex justify-between items-center gap-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-text hover:text-primary uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shop Catalog
        </Link>
        {isSuperAdmin && (
          <Link href={`/admin/products/${product.id}`}>
            <span className="cursor-pointer bg-white border border-gray-border hover:border-primary text-dark hover:text-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs">
              <Edit size={14} className="text-primary" /> Edit Product (Super Admin)
            </span>
          </Link>
        )}
      </div>

      <ProductConfigurator product={plainProduct} />
    </div>
  );
}
