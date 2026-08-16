import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { siteSettings } from '@/data/settings';
import { faqs } from '@/data/faqs';
import { ArrowRight, Printer, ShieldCheck, Heart, Clock, MessageCircle, MapPin, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

// Static presentation page
export default function HomePage() {
  const isSuperAdmin = false;
  const settings = siteSettings;
  const activeCategories = categories.filter((c) => c.isEnabled);
  const featuredProducts = products.filter((p) => p.isFeatured && p.isActive).slice(0, 8);
  const activeFaqs = faqs.filter((f) => f.isEnabled).slice(0, 4);

  const whatsappNumber = settings.contact_whatsapp || '+94771234567';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi,%20I'm%20interested%20in%20custom%20printing%20services!`;

  const heroTitle = settings.hero_title || "Print Your Memories. Create Something Special.";
  const heroSubtitle = settings.hero_subtitle || "Professional photo printing, high-end color studio lab services, customized mugs, custom premium photo framing, and corporate digital printing. Bring your photos to life with vivid color accuracy.";
  const heroImageUrl = settings.hero_image_url || "";

  // Hero Card Customizable Settings
  const heroBadgeText = settings.hero_badge_text || "Best Seller";
  const heroBadgeBg = settings.hero_badge_bg || "#ef4444";
  const heroPromoTitle = settings.hero_promo_title || (featuredProducts[0]?.name || "Custom Stickers & Labels");
  const heroPromoCategory = settings.hero_promo_category || (featuredProducts[0]?.categoryName || "Business Printing");
  const heroPromoPrice = settings.hero_promo_price || (featuredProducts[0] ? `Rs. ${Number(featuredProducts[0].price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}` : "Rs. 1,200.00");
  const heroPromoImage = settings.hero_promo_image || (featuredProducts[0]?.images[0]?.url || "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400");
  const heroPromoDesc = settings.hero_promo_desc || (featuredProducts[0]?.shortDescription || "High Quality • Durable");
  const productCardBtnText = settings.product_card_btn_text || "Create Your Own";

  const standardsTitle = settings.standards_title || "Premium Studio Standards Since Day One";
  const standardsDesc = settings.standards_desc || "At C.I. Technologies & Color Lab, we use high-density printing machinery to guarantee precise details, deep blacks, and rich vibrant colors. We use authentic wooden framing materials and anti-glare matt glass to elevate your spaces.";
  const standardsPointsRaw = settings.standards_points || "Advanced Color Correction, Moisture Resistant Coating, Multi-Layer Quality Auditing, Safe Packaging (Wood Frames)";
  const standardsPoints = standardsPointsRaw.split(',').map(p => p.trim()).filter(Boolean);
  const standardsImageUrl = settings.standards_image_url || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600";

  return (
    <div className="flex flex-col w-full pb-12">
      {/* 1. Hero Section */}
      <section className="relative bg-dark text-white overflow-hidden py-20 lg:py-32 animate-fade-in">
        {heroImageUrl ? (
          heroImageUrl.endsWith('.mp4') || heroImageUrl.endsWith('.webm') ? (
            <video src={heroImageUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none" />
          ) : (
            <img src={heroImageUrl} className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" alt="" />
          )
        ) : (
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          {/* Main Hero Copy */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-extrabold tracking-wider uppercase text-gray-200">#colorlab99 Studio Services</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
              {heroTitle}
            </h1>
            
            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto font-bold text-sm gap-2">
                  Order Printing Now <ArrowRight size={16} />
                </Button>
              </Link>

              <Link href="/services" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-700 text-white hover:bg-white/10 font-bold text-sm">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Decorative Promo Card */}
          <div className="hidden lg:flex justify-center relative">
            <Link href={featuredProducts[0] ? `/product/${featuredProducts[0].slug}` : '/shop'} className="block">
              <div className="w-80 h-96 bg-soft-dark border border-gray-800 rounded-2xl p-4 shadow-2xl relative rotate-3 hover:rotate-0 transition-all duration-300 cursor-pointer">
                <div className="w-full h-64 bg-gray-900 rounded-lg overflow-hidden relative border border-gray-800">
                  <img
                    src={heroPromoImage}
                    alt={heroPromoTitle}
                    className="object-cover w-full h-full"
                  />
                  <div
                    className="absolute top-2 right-2 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow-xs tracking-wider"
                    style={{ backgroundColor: heroBadgeBg }}
                  >
                    {heroBadgeText}
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{heroPromoCategory}</p>
                  <h4 className="font-extrabold text-white text-base truncate">{heroPromoTitle}</h4>
                  <div className="flex justify-between items-center pt-1.5">
                    <span className="text-sm font-black text-white">{heroPromoPrice}</span>
                    <span className="text-[10px] text-gray-text truncate max-w-[120px]">{heroPromoDesc}</span>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Absolute offset item */}
            {(() => {
              const mugCategory = categories.find(c => c.slug === 'mug-printing');
              return (
                <Link href={mugCategory ? `/shop?category=${mugCategory.slug}` : '/shop'} className="block">
                  <div className="w-48 h-48 bg-primary rounded-2xl p-3 shadow-xl absolute -bottom-6 -left-12 -rotate-6 hidden xl:block hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer z-20 border border-white/10">
                    <div className="w-full h-24 bg-white/15 rounded-lg flex items-center justify-center text-white overflow-hidden">
                      {mugCategory?.imageUrl ? (
                        <img src={mugCategory.imageUrl} alt="Mug Printing Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Printer size={40} />
                      )}
                    </div>
                    <div className="mt-3 text-white">
                      <h5 className="font-bold text-xs uppercase tracking-wider truncate">{mugCategory?.name || 'Mug Printing'}</h5>
                      <p className="text-[10px] opacity-80 mt-0.5 truncate">{mugCategory?.description || 'Custom layout previews'}</p>
                    </div>
                  </div>
                </Link>
              );
            })()}
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">Browse Categories</h2>
          <p className="text-xs sm:text-sm text-gray-text mt-2">
            Select a specialized print category to view customization options, sizes, and templates.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <div key={cat.id} className="relative group">
              <Link
                href={`/shop?category=${cat.slug}`}
                className="block bg-white border border-gray-border rounded-xl p-4 text-center hover:border-primary hover:shadow-md transition-all duration-200 h-full"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center mx-auto group-hover:scale-110 transition-transform bg-primary/10 border border-gray-100">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <Printer size={24} className="text-primary" />
                  )}
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-dark mt-4 line-clamp-1 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-gray-text mt-1 line-clamp-2">
                  {cat.description || 'Customizable layout items.'}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Popular Products Section */}
      <section className="bg-bg-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">Popular Products</h2>
              <p className="text-xs sm:text-sm text-gray-text mt-1">
                Our customer-favorite digital prints and customized frames in Sri Lanka.
              </p>
            </div>
            <Link href="/shop" className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 shrink-0">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const defaultImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400';
              return (
                <div
                  key={product.id}
                  className="bg-white border border-gray-border rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-primary/50 transition-all duration-200 flex flex-col relative animate-fade-in"
                >
                  <Link href={`/product/${product.slug}`} className="block relative w-full h-48 bg-gray-100 overflow-hidden border-b border-gray-border">
                    <img
                      src={defaultImage}
                      alt={product.name}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                    {product.salePrice && (
                      <span className={`absolute ${isSuperAdmin ? 'top-11' : 'top-2'} left-2 bg-accent-red text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider z-10`}>
                        Promo Sale
                      </span>
                    )}
                    <span className="absolute top-2 right-2 bg-white/95 text-dark text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-sm border border-gray-100">
                      CUSTOMIZABLE
                    </span>
                  </Link>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-dark hover:text-primary transition-colors line-clamp-1">
                        <Link href={`/product/${product.slug}`}>{product.name}</Link>
                      </h3>
                      <p className="text-[11px] text-gray-text line-clamp-2">
                        {product.shortDescription || 'Upload your photo and print.'}
                      </p>
                    </div>
                    <div className="pt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.salePrice ? (
                          <>
                            <span className="text-xs line-through text-gray-text">Rs. {Number(product.price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                            <span className="text-sm font-black text-accent-red">Rs. {Number(product.salePrice).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                          </>
                        ) : (
                          <span className="text-sm font-black text-dark">Rs. {Number(product.price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                        )}
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
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">How to Order Custom Prints</h2>
          <p className="text-xs sm:text-sm text-gray-text mt-2">
            Get your prints done in 5 simple steps without leaving your house.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
          <div className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 bg-dark text-white rounded-full flex items-center justify-center font-bold text-base shadow-sm">1</div>
            <h4 className="font-bold text-sm text-dark mt-4">Select Product</h4>
            <p className="text-xs text-gray-text mt-1.5">Choose frames, mugs, shirts, or standard paper photo sizes.</p>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 bg-dark text-white rounded-full flex items-center justify-center font-bold text-base shadow-sm">2</div>
            <h4 className="font-bold text-sm text-dark mt-4">Customize & Upload</h4>
            <p className="text-xs text-gray-text mt-1.5">Pick dimensions, frames, paper finishes, and upload your high-res photos.</p>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 bg-dark text-white rounded-full flex items-center justify-center font-bold text-base shadow-sm">3</div>
            <h4 className="font-bold text-sm text-dark mt-4">Design Approval</h4>
            <p className="text-xs text-gray-text mt-1.5">Our designers verify colors, align frames, and send previews if required.</p>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 bg-dark text-white rounded-full flex items-center justify-center font-bold text-base shadow-sm">4</div>
            <h4 className="font-bold text-sm text-dark mt-4">Print & Quality Lab</h4>
            <p className="text-xs text-gray-text mt-1.5">Printed using premium ink configurations and inspected for defects.</p>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-base shadow-sm">5</div>
            <h4 className="font-bold text-sm text-dark mt-4">Safe Delivery</h4>
            <p className="text-xs text-gray-text mt-1.5">Double-bubble wrapped and delivered to your doorstep islandwide.</p>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="bg-dark text-white py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight border-l-4 border-primary pl-3">
              {standardsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-text leading-relaxed">
              {standardsDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold pt-2">
              {standardsPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2 text-white">
                  <CheckCircle size={16} className="text-primary" /> {point}
                </div>
              ))}
            </div>
            <div className="pt-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary">
                  <MessageCircle size={18} /> Chat with a Specialist
                </Button>
              </a>
            </div>
          </div>
          <div className="relative h-64 lg:h-96 w-full rounded-2xl overflow-hidden border border-gray-800">
            <img
              src={standardsImageUrl}
              alt="Photo Printing Quality"
              className="object-cover w-full h-full opacity-85"
            />
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 w-full relative">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-gray-text mt-2">
            Find answers to common photo upload, framing options, and payment inquiries.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white border border-gray-border rounded-xl p-5 shadow-xs">
              <h4 className="font-extrabold text-sm sm:text-base text-dark">
                {faq.question}
              </h4>
              <p className="text-xs sm:text-sm text-gray-text mt-2 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
