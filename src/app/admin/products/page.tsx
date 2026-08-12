import React from 'react';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ShoppingBag, Eye, AlertTriangle, ArrowUpDown, Plus } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export const revalidate = 0;

interface AdminProductsPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const session = await getSession();
  
  // Guard access
  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
  }

  const params = await searchParams;
  const search = params.search || '';

  // Build query
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sku: { contains: search } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: { sku: 'asc' },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Product Catalog</h1>
          <p className="text-xs sm:text-sm text-gray-text mt-1">
            Manage pricing, opening stock levels, low-stock thresholds, and custom print option variants.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" className="text-xs font-bold gap-1 py-2 px-4">
            <Plus size={16} /> Add Product
          </Button>
        </Link>
      </div>

      {/* Utilities */}
      <div className="bg-white border border-gray-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <form action="/admin/products" method="GET" className="flex gap-2 w-full md:w-96">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by product name or SKU..."
            className="w-full border border-gray-border rounded-lg px-3 py-1.5 text-xs bg-white text-dark focus:outline-none focus:border-primary placeholder-gray-400"
          />
          <Button type="submit" variant="primary" size="sm" className="px-4">
            Search
          </Button>
        </form>

        <div className="text-xs text-gray-text font-semibold">
          Total Products: <span className="text-dark font-bold">{products.length}</span>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-gray-border rounded-xl overflow-hidden shadow-xs">
        {products.length === 0 ? (
          <div className="text-center py-16 text-xs text-gray-text">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-bg-light border-b border-gray-border text-gray-text uppercase font-bold tracking-wider">
                  <th className="p-4">SKU</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Cost Price</th>
                  <th className="p-4 text-right">Selling Price</th>
                  <th className="p-4 text-center">Stock Level</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-dark">
                {products.map((p) => {
                  const isLowStock = p.stock <= p.lowStockThreshold;
                  return (
                    <tr key={p.id} className="hover:bg-bg-light/40 transition-colors">
                      <td className="p-4 font-bold text-gray-text">{p.sku}</td>
                      <td className="p-4 font-extrabold text-dark flex items-center gap-1.5">
                        {p.name}
                        {isLowStock && (
                          <span className="text-accent-red" title="Low Stock Warning">
                            <AlertTriangle size={14} />
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-text">{p.category.name}</td>
                      <td className="p-4 text-right text-gray-text">
                        Rs. {Number(p.costPrice).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-right font-bold text-primary">
                        Rs. {Number(p.price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-center font-bold">
                        <span className={`px-2 py-1 rounded font-extrabold ${isLowStock ? 'bg-red-50 text-accent-red border border-red-100' : 'text-dark'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Link href={`/admin/products/${p.id}`}>
                          <Button size="sm" variant="outline" className="text-[10px] py-1 px-2.5 font-bold gap-1 mx-auto">
                            <Eye size={12} /> Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
