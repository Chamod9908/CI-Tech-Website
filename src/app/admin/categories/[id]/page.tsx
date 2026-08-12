import React from 'react';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import CategoryForm from '@/components/admin/CategoryForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const session = await getSession();

  // Guard access: restrict to staff
  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
  }

  const { id } = await params;

  // Fetch the category details
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-text hover:text-primary uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={16} /> Back to Categories list
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Edit Category</h1>
        <p className="text-xs sm:text-sm text-gray-text mt-1">
          Modify category names, routing slugs, description summaries, or change thumbnail graphics.
        </p>
      </div>

      <CategoryForm initialData={category} />
    </div>
  );
}
