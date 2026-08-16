import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Tag, Flame, Gift } from 'lucide-react';
import { offers as staticOffers } from '@/data/offers';
import { products as staticProducts } from '@/data/products';
import { siteSettings } from '@/data/settings';

export default function OffersPage() {
  const settings = siteSettings;
  const productCardBtnText = settings.product_card_btn_text || 'Create Your Own';

  const heroBgImage = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1600';
  const heroBadge = 'Special Studio Deals & Limited Offers';
  const heroTitle = 'Exclusive Studio Offers & Discounted Packages';
  const heroDesc = 'Save big on custom wooden photo framing, high-density photo printing, ceramic mug printing, and corporate gifts. Enjoy islandwide delivery on all orders.';
  const promoCode = 'COLORLAB15';
  const promoDiscount = 'Get 15% OFF on custom framing packages!';

  const visibleBundles = staticOffers;
  const featuredProducts = staticProducts.filter((p) => p.isFeatured && p.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12 min-h-screen">

      {/* 1. Hero Promo Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-dark via-gray-900 to-dark text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-800">
        {/* Hero Background Image */}
        {heroBgImage && (
          <div className="absolute inset-0 pointer-events-none z-0">
            <img
              src={heroBgImage}
              alt="Hero Background"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
          </div>
        )}

        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-accent-red/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary-light text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Flame size={14} className="text-primary" /> {heroBadge}
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {heroTitle}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
            {heroDesc}
          </p>

          {/* Coupon Code Highlight */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <Tag size={16} className="text-primary" />
              <span className="text-xs font-semibold text-gray-300">Use Promo Code:</span>
              <span className="text-xs font-black text-primary font-mono uppercase bg-primary/20 px-2 py-0.5 rounded">{promoCode}</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">{promoDiscount}</span>
          </div>
        </div>
      </div>

      {/* 2. Studio Special Value Bundles Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-dark tracking-tight flex items-center gap-2">
              <Gift className="text-primary" size={22} /> Special Print Bundle Deals
            </h2>
            <p className="text-xs text-gray-text mt-0.5">Pre-configured bundles designed to give you maximum savings.</p>
          </div>
        </div>

        {visibleBundles.length === 0 ? (
          <div className="bg-white border border-gray-border rounded-2xl p-8 text-center text-xs text-gray-text">
            No active promotional bundle deals at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleBundles.map((bundle) => {
              return (
                <div
                  key={bundle.id}
                  className="bg-white border border-gray-border hover:border-primary rounded-2xl p-6 shadow-xs space-y-4 transition-all hover:shadow-md flex flex-col justify-between relative"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block bg-primary/10 text-primary"
                      >
                        {bundle.badge || 'SPECIAL OFFER'}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-dark">{bundle.title}</h3>
                    <p className="text-xs text-gray-text leading-relaxed">{bundle.description}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      {bundle.promoCode && (
                        <span className="text-[10px] text-gray-400 font-bold uppercase block font-mono">
                          CODE: {bundle.promoCode}
                        </span>
                      )}
                      <span className="text-base font-black text-primary">
                        {bundle.discountPercentage ? `${bundle.discountPercentage}% OFF` : 'SPECIAL PRICE'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={bundle.ctaLink || '/shop'}>
                        <Button variant="primary" size="sm" className="font-bold text-xs">
                          {bundle.ctaText || productCardBtnText}
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

      {/* 3. Promotional Products Catalog Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-border pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-dark tracking-tight flex items-center gap-2">
              <Tag className="text-primary" size={22} /> Featured Studio Products
            </h2>
            <p className="text-xs text-gray-text mt-0.5">Explore active promotional pricing across our custom print studio catalog.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-text">Found {featuredProducts.length} Items</span>
          </div>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="bg-white border border-gray-border rounded-2xl p-12 text-center space-y-3">
            <p className="text-sm font-bold text-dark">No promotional items available right now.</p>
            <p className="text-xs text-gray-text">Check back soon for new discounts and seasonal studio sales.</p>
            <Link href="/shop" className="inline-block bg-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl">
              Browse Full Shop Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const displayImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400';
              const originalPrice = product.price;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-gray-border hover:border-primary rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group relative"
                >
                  {/* Image Box */}
                  <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="bg-accent-red text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        SPECIAL OFFER
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                        {product.categoryName || 'Printing Service'}
                      </span>
                      <h3 className="text-sm font-black text-dark group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      {product.shortDescription && (
                        <p className="text-xs text-gray-text line-clamp-2 leading-relaxed">
                          {product.shortDescription}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-accent-red">
                          Rs. {originalPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <Link href={`/product/${product.slug}`}>
                        <Button variant="primary" size="sm" className="px-3 py-1.5 rounded-md text-xs font-bold">
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
  );
}
