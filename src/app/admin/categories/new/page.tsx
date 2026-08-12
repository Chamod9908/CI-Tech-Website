import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CategoryForm from '@/components/admin/CategoryForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function NewCategoryPage() {
  const session = await getSession();

  // Guard access: restrict to staff
  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
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
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Add New Category</h1>
        <p className="text-xs sm:text-sm text-gray-text mt-1">
          Define a new storefront print category, set routing slugs, and upload preview images.
        </p>
      </div>

      <CategoryForm />
    </div>
  );
}
