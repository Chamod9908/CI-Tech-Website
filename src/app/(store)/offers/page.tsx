import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import Button from '@/components/ui/Button';
import { Tag, Sparkles, Flame, Gift, Edit, Plus, Eye, EyeOff } from 'lucide-react';
import { getAllSiteSettings } from '@/lib/settings';
import { getSession } from '@/lib/auth';
import { QuickProductControls } from '@/components/admin/QuickAdminControls';
import { BundleDeal } from '@/components/admin/OffersManager';
import QuickOfferBannerEditor from '@/components/admin/QuickOfferBannerEditor';

export const revalidate = 0;

export default async function OffersPage() {
  const session = await getSession();
  const isSuperAdmin = session && session.role !== 'CUSTOMER';

  const settings = await getAllSiteSettings();
  const productCardBtnText = settings.product_card_btn_text || 'Create Your Own';

  // Dynamic Header Settings
  const heroBgImage = settings.offers_hero_bg_image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1600';
  const heroBadge = settings.offers_hero_badge || 'Special Studio Deals & Limited Offers';
  const heroTitle = settings.offers_hero_title || 'Exclusive Studio Offers & Discounted Packages';
  const heroDesc = settings.offers_hero_desc || 'Save big on custom wooden photo framing, high-density photo printing, ceramic mug printing, and corporate gifts. Enjoy islandwide delivery on all orders.';
  const promoCode = settings.offers_promo_code || 'COLORLAB15';
  const promoDiscount = settings.offers_promo_discount || 'Get 15% OFF on custom framing packages!';

  // Default bundles fallback
  const defaultBundles: BundleDeal[] = [
    {
      id: 'bundle-1',
      badge: 'SAVE 20%',
      badgeColor: 'emerald',
      title: 'Wall Framing Combo Pack',
      desc: 'Includes 1 Large Canvas Frame (12x18) + 2 Desk Photo Frames (6x8) with anti-glare lamination.',
      originalPrice: 4500,
      salePrice: 3600,
      isHidden: false,
      linkUrl: '/shop',
    },
    {
      id: 'bundle-2',
      badge: 'POPULAR DEAL',
      badgeColor: 'primary',
      title: 'Custom Gift Mug Duo',
      desc: 'Order 2 Personalized Photo Mugs with HD color correction & premium gift box packaging.',
      originalPrice: 1900,
      salePrice: 1580,
      isHidden: false,
      linkUrl: '/shop',
    },
    {
      id: 'bundle-3',
      badge: 'HOT OFFER',
      badgeColor: 'red',
      title: 'Wedding Memory Album Suite',
      desc: 'Premium Glossy Photo Album Book (40 pages) + 1 Free Synthetic Wooden Table Plaque.',
      originalPrice: 10300,
      salePrice: 8200,
      isHidden: false,
      linkUrl: '/shop',
    },
  ];

  let bundles: BundleDeal[] = [];
  if (settings.offers_bundles_json) {
    try {
      bundles = JSON.parse(settings.offers_bundles_json);
    } catch {
      bundles = [];
    }
  }

  // Filter out hidden bundles for standard customer view
  const visibleBundles = isSuperAdmin ? bundles : bundles.filter((b) => !b.isHidden);

  // Query ONLY products that are explicitly on sale (have a salePrice set by admin)
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      salePrice: { not: null },
    },
    include: {
      images: true,
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12 min-h-screen">
      
      {/* Super Admin Quick Actions Bar */}
      {isSuperAdmin && (
        <div className="bg-dark text-white p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-gray-800 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              STAFF MANAGEMENT VIEW
            </span>
            <span className="text-xs text-gray-300 font-semibold">You have full admin permissions to modify offers, banners, and bundles.</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/offers"
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Edit size={14} /> Admin Offers Manager
            </Link>
          </div>
        </div>
      )}

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

        {/* Quick Admin Edit Button for Banner */}
        <QuickOfferBannerEditor
          isSuperAdmin={Boolean(isSuperAdmin)}
          initialBgImage={heroBgImage}
          initialBadge={heroBadge}
          initialTitle={heroTitle}
          initialDesc={heroDesc}
          initialPromoCode={promoCode}
          initialPromoDiscount={promoDiscount}
        />

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

          {isSuperAdmin && (
            <Link href="/admin/offers" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <Plus size={14} /> Add / Modify Bundles
            </Link>
          )}
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
                  className={`bg-white border hover:border-primary rounded-2xl p-6 shadow-xs space-y-4 transition-all hover:shadow-md flex flex-col justify-between relative ${
                    bundle.isHidden ? 'opacity-60 border-dashed border-gray-400' : 'border-gray-border'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block ${
                          bundle.badgeColor === 'red'
                            ? 'bg-red-100 text-accent-red'
                            : bundle.badgeColor === 'primary'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {bundle.badge}
                      </span>

                      {isSuperAdmin && bundle.isHidden && (
                        <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">
                          HIDDEN (ADMIN)
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-dark">{bundle.title}</h3>
                    <p className="text-xs text-gray-text leading-relaxed">{bundle.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs line-through text-gray-400 font-semibold block">
                        Rs. {bundle.originalPrice.toLocaleString('en-LK', { minimumFractionDigits: 0 })}
                      </span>
                      <span className="text-base font-black text-primary">
                        Rs. {bundle.salePrice.toLocaleString('en-LK', { minimumFractionDigits: 0 })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSuperAdmin && (
                        <Link href="/admin/offers" className="text-xs font-bold text-gray-500 hover:text-primary p-1">
                          <Edit size={14} />
                        </Link>
                      )}
                      <Link href={bundle.linkUrl || '/shop'}>
                        <Button variant="primary" size="sm" className="font-bold text-xs">
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

      {/* 3. Promotional Products Catalog Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-border pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-dark tracking-tight flex items-center gap-2">
              <Tag className="text-primary" size={22} /> On-Sale Products & Promotional Items
            </h2>
            <p className="text-xs text-gray-text mt-0.5">Explore active promotional pricing across our custom print studio catalog.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-text hidden sm:inline">Found {products.length} Items</span>
            {isSuperAdmin && (
              <Link
                href="/admin/products/new"
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Plus size={14} /> Add On-Sale Product
              </Link>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white border border-gray-border rounded-2xl p-12 text-center space-y-3">
            <p className="text-sm font-bold text-dark">No promotional items available right now.</p>
            <p className="text-xs text-gray-text">Check back soon for new discounts and seasonal studio sales.</p>
            <Link href="/shop" className="inline-block bg-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl">
              Browse Full Shop Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => {
              const displayImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400';
              const originalPrice = Number(product.price);
              const salePrice = product.salePrice ? Number(product.salePrice) : originalPrice;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-gray-border hover:border-primary rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group relative"
                >
                  {/* Image Box */}
                  <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                    {/* Admin Quick Controls */}
                    <QuickProductControls
                      productId={product.id}
                      isActive={product.isActive}
                      isSuperAdmin={Boolean(isSuperAdmin)}
                      productName={product.name}
                      currentPrice={originalPrice}
                      currentSalePrice={product.salePrice ? Number(product.salePrice) : null}
                    />

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
                        {product.category?.name || 'Printing Service'}
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
                        <span className="text-[10px] line-through text-gray-400 font-bold">
                          Rs. {originalPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-sm font-black text-accent-red">
                          Rs. {salePrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
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
