import React from 'react';
import Link from 'next/link';
import { ArrowRight, Printer, Scissors, Sparkles, Image as ImageIcon, Award, Heart, Edit } from 'lucide-react';
import Button from '@/components/ui/Button';
import { services as staticServices } from '@/data/services';

export default function ServicesPage() {
  const isSuperAdmin = false;

  const iconMap: Record<string, any> = {
    Printer,
    Scissors,
    Sparkles,
    ImageIcon,
    Award,
    Heart,
    Edit,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen space-y-12 relative">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-4xl font-extrabold text-dark tracking-tight">Printing Services</h1>
        <p className="text-xs sm:text-sm text-gray-text mt-2">
          From high-resolution photo restoration to dynamic corporate branding — explore what we do at #colorlab99.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staticServices.map((service) => {
          const IconComponent = (service.iconName && iconMap[service.iconName]) || Printer;
          return (
            <div
              key={service.id}
              className="bg-white border border-gray-border rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center">
                  <IconComponent size={22} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-dark tracking-tight">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-text leading-relaxed">{service.shortDescription}</p>
                </div>

                {service.features && service.features.length > 0 && (
                  <ul className="space-y-1 pt-2">
                    {service.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-[11px] text-gray-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-6">
                <Link href={`/shop?category=${service.categorySlug}`}>
                  <Button variant="outline" size="sm" className="w-full font-bold text-xs gap-1">
                    Explore & Order <ArrowRight size={14} />
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
