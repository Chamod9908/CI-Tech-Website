import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ArrowRight, Printer, Scissors, HelpCircle, Palette, Sparkles, Image as ImageIcon, Edit } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getSession } from '@/lib/auth';

export const revalidate = 0;

export default async function ServicesPage() {
  const session = await getSession();
  const isSuperAdmin = session?.role === 'SUPER_ADMIN';

  const categories = await prisma.category.findMany({
    where: { isEnabled: true },
    orderBy: { orderIndex: 'asc' },
  });

  const servicesDetails = [
    { slug: 'photo-printing', icon: ImageIcon, title: 'Color Lab Photo Printing', desc: 'Standard and large format print services. Multiple photographic paper finishes (glossy, matte, satin) printed with color precision.' },
    { slug: 'photo-frames', icon: Sparkles, title: 'Custom Framing & Mounts', desc: 'Solid wood structures, synthetic border profiles, glass covers (matte, clear), and backing sheets custom sized to fits any photo.' },
    { slug: 'mug-printing', icon: Printer, title: 'Personalized Mug Sublimation', desc: 'High-quality prints on ceramic tableware. Variants include magic color-change, glitters, inner colors, and birthday custom designs.' },
    { slug: 'personalized-gifts', icon: Palette, title: 'Bespoke Gifts & Plaque wood', desc: 'Custom printed keytags, wooden plaques, custom t-shirts, crystals, and personalized commemorative boxes.' },
    { slug: 'business-printing', icon: Scissors, title: 'Branding & Commercial Print', desc: 'Business cards, invitation cards, custom labels, stickers, booklets, and corporate marketing assets.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen space-y-12 relative">
      {isSuperAdmin && (
        <div className="absolute top-2 right-4 z-20">
          <Link href="/admin/settings">
            <span className="cursor-pointer bg-white border border-gray-border hover:border-primary text-dark hover:text-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs">
              <Edit size={14} className="text-primary" /> Edit Service Settings
            </span>
          </Link>
        </div>
      )}
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-4xl font-extrabold text-dark tracking-tight">Printing Services</h1>
        <p className="text-xs sm:text-sm text-gray-text mt-2">
          From high-resolution photo restoration to dynamic corporate branding — explore what we do at #colorlab99.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesDetails.map((service, idx) => {
          const IconComponent = service.icon || Printer;
          return (
            <div
              key={idx}
              className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center">
                  <IconComponent size={22} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-dark tracking-tight">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-text leading-relaxed">{service.desc}</p>
                </div>
              </div>

              <div className="pt-6">
                <Link href={`/shop?category=${service.slug}`}>
                  <Button variant="outline" size="sm" className="w-full font-bold text-xs gap-1">
                    Configure Products <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
