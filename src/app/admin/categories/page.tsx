import React from 'react';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Plus, Edit } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const session = await getSession();
  
  // Guard access: restrict to staff
  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
  }

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Print Categories</h1>
          <p className="text-xs sm:text-sm text-gray-text mt-1">
            Create, enable, or disable storefront categories for photo labs, framing options, and corporate gifts.
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button variant="primary" className="text-xs font-bold gap-1 py-2 px-4">
            <Plus size={16} /> Add Category
          </Button>
        </Link>
      </div>

      {/* Table grid */}
      <div className="bg-white border border-gray-border rounded-xl overflow-hidden shadow-xs">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-xs text-gray-text">
            No categories registered yet. Click &quot;Add Category&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-bg-light border-b border-gray-border text-gray-text uppercase font-bold tracking-wider">
                  <th className="p-4">Sort Order</th>
                  <th className="p-4">Category Name</th>
                  <th className="p-4">URL Slug</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-center">Products Count</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-dark">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-bg-light/40 transition-colors">
                    <td className="p-4 text-gray-text font-bold">#{c.orderIndex + 1}</td>
                    <td className="p-4 font-extrabold text-dark flex items-center gap-3">
                      {c.imageUrl ? (
                        <img 
                          src={c.imageUrl} 
                          alt={c.name} 
                          className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-gray-100 font-black text-[10px] shrink-0">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span>{c.name}</span>
                    </td>
                    <td className="p-4 text-primary font-bold">{c.slug}</td>
                    <td className="p-4 text-gray-text max-w-xs truncate">{c.description || '-'}</td>
                    <td className="p-4 text-center font-bold">{c._count.products}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${c.isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.isEnabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Link href={`/admin/categories/${c.id}`}>
                          <span className="cursor-pointer bg-white border border-gray-border hover:border-primary text-dark hover:text-primary text-[10px] font-bold px-2 py-1.5 rounded-lg inline-flex items-center gap-1 transition-all shadow-3xs">
                            <Edit size={10} className="text-primary" /> Edit
                          </span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
