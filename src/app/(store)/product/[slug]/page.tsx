import React from 'react';
import { notFound } from 'next/navigation';
import ProductConfigurator from '@/components/product/ProductConfigurator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { products as staticProducts } from '@/data/products';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const isSuperAdmin = false;
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const product = staticProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const plainProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    shortDescription: product.shortDescription || null,
    price: product.price,
    salePrice: null,
    images: product.images.map((img, idx) => ({ id: img.id || `img-${idx}`, url: img.url })),
    options: (product.options || []).map((opt, optIdx) => ({
      id: opt.id || `opt-${optIdx}`,
      name: opt.name,
      isRequired: opt.isRequired ?? true,
      values: opt.values.map((val, valIdx) => ({
        id: val.id || `val-${valIdx}`,
        value: val.value,
        priceAdjustment: val.priceAdjustment,
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
      </div>

      <ProductConfigurator product={plainProduct} />
    </div>
  );
}
