import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Search, SlidersHorizontal, ArrowUpDown, Edit } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import ShopSortSelect from '@/components/product/ShopSortSelect';
import { QuickProductControls, QuickCategoryControls } from '@/components/admin/QuickAdminControls';

export const revalidate = 0;

interface ShopPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    filter?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const session = await getSession();
  const isSuperAdmin = session?.role === 'SUPER_ADMIN';
  const params = await searchParams;
  const search = params.search || '';
  const category = params.category || '';
  const filter = params.filter || '';
  const sort = params.sort || 'newest';

  // 1. Fetch Categories for Filter Bar (Super Admin sees hidden categories too)
  const categories = await prisma.category.findMany({
    where: isSuperAdmin ? undefined : { isEnabled: true },
    orderBy: { orderIndex: 'asc' },
  });

  // 2. Build Prisma Query Filters (Super Admin sees hidden products too)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: Record<string, any> = {};
  if (!isSuperAdmin) {
    whereClause.isActive = true;
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { sku: { contains: search } },
    ];
  }

  if (category) {
    whereClause.category = { slug: category };
  }

  if (filter === 'sale') {
    whereClause.salePrice = { not: null };
  }

  // 3. Build Sorting Logic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderByClause: any = { createdAt: 'desc' };
  if (sort === 'price-asc') {
    orderByClause = { price: 'asc' };
  } else if (sort === 'price-desc') {
    orderByClause = { price: 'desc' };
  } else if (sort === 'popular') {
    orderByClause = { isFeatured: 'desc' };
  }

  // 4. Query Products
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: orderByClause,
    include: {
      images: true,
      category: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header and Title */}
      <div className="border-b border-gray-border pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Shop Digital Prints & Giftware</h1>
          <p className="text-xs sm:text-sm text-gray-text mt-1">
            Configure framing layouts, select mug designs, or upload custom artwork for canvas blocks.
          </p>
        </div>
        
        {/* Active Breadcrumb/Indicators */}
        {search && (
          <div className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-md">
            Showing results for &quot;{search}&quot;
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Panel Sidebar Filters */}
        <div className="space-y-6 lg:col-span-1">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-extrabold text-dark uppercase tracking-widest">Categories</h4>
              {isSuperAdmin && (
                <Link href="/admin/categories" className="text-primary hover:text-primary-hover flex items-center gap-0.5 text-[10px] font-bold transition-colors" title="Manage Categories (Super Admin)">
                  <Edit size={12} /> Manage
                </Link>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Link
                href="/shop"
                className={`text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors ${
                  !category
                    ? 'bg-primary text-white'
                    : 'text-dark hover:bg-gray-100'
                }`}
              >
                All Categories
              </Link>
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between gap-2 group/cat">
                  <Link
                    href={`/shop?category=${cat.slug}&sort=${sort}${search ? `&search=${search}` : ''}`}
                    className={`text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors flex-1 min-w-0 truncate ${
                      category === cat.slug
                        ? 'bg-primary text-white'
                        : 'text-dark hover:bg-gray-100'
                    } ${!cat.isEnabled ? 'opacity-55 line-through text-gray-text' : ''}`}
                  >
                    {cat.name}
                  </Link>
                  <QuickCategoryControls
                    categoryId={cat.id}
                    isEnabled={cat.isEnabled}
                    isSuperAdmin={isSuperAdmin}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-border pt-6">
            <h4 className="text-xs font-extrabold text-dark uppercase tracking-widest mb-4">Offers & Filters</h4>
            <div className="flex flex-col space-y-2">
              <Link
                href={`/shop?${category ? `category=${category}&` : ''}filter=sale&sort=${sort}`}
                className={`text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors ${
                  filter === 'sale'
                    ? 'bg-accent-red text-white'
                    : 'text-dark hover:bg-gray-100'
                }`}
              >
                Promotional Offers
              </Link>
            </div>
          </div>
        </div>

        {/* Right Product Grid Container */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort / Utility Bar */}
          <div className="bg-bg-light p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-text font-semibold">
                Found <span className="text-dark font-bold">{products.length}</span> products
              </div>
              {isSuperAdmin && (
                <Link href={(() => {
                  const currentCatObj = categories.find(c => c.slug === category);
                  return currentCatObj 
                    ? `/admin/products/new?categoryId=${currentCatObj.id}`
                    : '/admin/products/new';
                })()}>
                  <span className="cursor-pointer bg-white border border-gray-border hover:border-primary text-dark hover:text-primary text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-2xs">
                    + Add Product
                  </span>
                </Link>
              )}
            </div>
            
            {/* Sorting Dropdowns */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-text font-bold uppercase tracking-wider flex items-center gap-1">
                <ArrowUpDown size={14} /> Sort By
              </span>
              <ShopSortSelect currentSort={sort} />
            </div>
          </div>

          {/* Product Cards Grid */}
          {products.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-border rounded-2xl space-y-4">
              <p className="text-gray-text font-medium">No products found matching your active filters.</p>
              <Link href="/shop">
                <Button variant="outline" size="sm">Reset Filters</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {products.map((product) => {
                const defaultImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400';
                return (
                  <div
                    key={product.id}
                    className={`bg-white border rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-primary/50 transition-all duration-200 flex flex-col justify-between relative ${
                      !product.isActive ? 'opacity-85 border-dashed border-accent-red/40 bg-accent-red/5' : 'border-gray-border'
                    }`}
                  >
                    {!product.isActive && (
                      <span className="absolute bottom-2 left-2 bg-accent-red text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase z-20 shadow-xs select-none">
                        Hidden
                      </span>
                    )}

                    <QuickProductControls
                      productId={product.id}
                      isActive={product.isActive}
                      isSuperAdmin={isSuperAdmin}
                    />

                    {isSuperAdmin && (
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="absolute top-2 left-2 z-20 bg-white border border-gray-border text-dark rounded-full p-1.5 shadow-sm hover:text-primary transition-all inline-flex items-center justify-center cursor-pointer"
                        title="Edit Product (Super Admin)"
                      >
                        <Edit size={12} />
                      </Link>
                    )}
                    <Link href={`/product/${product.slug}`} className="block relative w-full h-44 bg-gray-100 overflow-hidden border-b border-gray-border">
                      <img
                        src={defaultImage}
                        alt={product.name}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                      {product.salePrice && (
                        <span className={`absolute ${isSuperAdmin ? 'top-11' : 'top-2'} left-2 bg-accent-red text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase z-10`}>
                          Sale
                        </span>
                      )}
                      <span className="absolute top-2 right-2 bg-white/95 text-[9px] text-dark font-extrabold px-2 py-0.5 rounded-md border border-gray-100 shadow-sm">
                        CUSTOM
                      </span>
                    </Link>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-primary uppercase font-bold tracking-widest">
                          {product.category.name}
                        </span>
                        <h3 className="font-extrabold text-sm text-dark hover:text-primary transition-colors line-clamp-1">
                          <Link href={`/product/${product.slug}`}>{product.name}</Link>
                        </h3>
                        <p className="text-[11px] text-gray-text line-clamp-2">
                          {product.shortDescription || 'Professional photo printing.'}
                        </p>
                      </div>
                      <div className="pt-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div className="flex flex-col">
                          {product.salePrice ? (
                            <>
                              <span className="text-[10px] line-through text-gray-text">Rs. {Number(product.price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                              <span className="text-sm font-black text-accent-red">Rs. {Number(product.salePrice).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                            </>
                          ) : (
                            <span className="text-sm font-black text-dark">Rs. {Number(product.price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                          )}
                        </div>
                        <Link href={`/product/${product.slug}`} className="shrink-0">
                          <Button variant="primary" size="sm" className="w-full sm:w-auto px-3 py-1.5 rounded-md text-xs">
                            Configure
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
