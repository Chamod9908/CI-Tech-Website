import React from 'react';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

interface NewProductPageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  const session = await getSession();

  // Route Guard: restrict to staff
  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
  }

  const params = await searchParams;
  const initialCategoryId = params.categoryId || '';

  // Fetch Categories for selection list
  const categories = await prisma.category.findMany({
    where: { isEnabled: true },
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-text hover:text-primary uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={16} /> Back to Catalog list
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Add New Product</h1>
        <p className="text-xs sm:text-sm text-gray-text mt-1">
          Configure a new product structure, set base pricing coordinates, and specify custom options.
        </p>
      </div>

      <ProductForm categories={categories} initialCategoryId={initialCategoryId} />
    </div>
  );
}
