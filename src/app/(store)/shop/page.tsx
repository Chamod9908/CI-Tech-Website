import React from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import ShopSortSelect from '@/components/product/ShopSortSelect';
import { categories as staticCategories } from '@/data/categories';
import { products as staticProducts, ProductData } from '@/data/products';
import { siteSettings } from '@/data/settings';

interface ShopPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    filter?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const settings = siteSettings;
  const productCardBtnText = settings.product_card_btn_text || 'Create Your Own';
  const params = await searchParams;
  const search = (params.search || '').toLowerCase();
  const categorySlug = params.category || '';
  const filter = params.filter || '';
  const sort = params.sort || 'newest';

  // 1. Categories for Filter Bar
  const categories = staticCategories.filter((c) => c.isEnabled);

  // 2. Filter Products
  let filteredProducts: ProductData[] = [...staticProducts];

  if (search) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search)
    );
  }

  if (categorySlug) {
    filteredProducts = filteredProducts.filter((p) => p.categorySlug === categorySlug);
  }

  if (filter === 'sale') {
    filteredProducts = filteredProducts.filter((p) => p.isFeatured);
  }

  // 3. Sorting
  if (sort === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'popular') {
    filteredProducts.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  const products = filteredProducts;

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
            </div>
            <div className="flex flex-col space-y-2">
              <Link
                href="/shop"
                className={`text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors ${
                  !categorySlug
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
                      categorySlug === cat.slug
                        ? 'bg-primary text-white'
                        : 'text-dark hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-border pt-6">
            <h4 className="text-xs font-extrabold text-dark uppercase tracking-widest mb-4">Offers & Filters</h4>
            <div className="flex flex-col space-y-2">
              <Link
                href={`/shop?${categorySlug ? `category=${categorySlug}&` : ''}filter=sale&sort=${sort}`}
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
                    className="bg-white border border-gray-border rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-primary/50 transition-all duration-200 flex flex-col justify-between relative"
                  >
                    <Link href={`/product/${product.slug}`} className="block relative w-full h-44 bg-gray-100 overflow-hidden border-b border-gray-border">
                      <img
                        src={defaultImage}
                        alt={product.name}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 right-2 bg-white/95 text-[9px] text-dark font-extrabold px-2 py-0.5 rounded-md border border-gray-100 shadow-sm">
                        CUSTOM
                      </span>
                    </Link>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-primary uppercase font-bold tracking-widest">
                          {product.categoryName || 'Product'}
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
                          <span className="text-sm font-black text-dark">Rs. {Number(product.price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <Link href={`/product/${product.slug}`} className="shrink-0">
                          <Button variant="primary" size="sm" className="w-full sm:w-auto px-3 py-1.5 rounded-md text-xs font-bold">
                            {productCardBtnText}
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
