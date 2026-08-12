'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, X, Save, UploadCloud, Sparkles, Image as ImageIcon } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

interface QuickOfferBannerEditorProps {
  isSuperAdmin: boolean;
  initialBgImage?: string;
  initialBadge: string;
  initialTitle: string;
  initialDesc: string;
  initialPromoCode: string;
  initialPromoDiscount: string;
}

export default function QuickOfferBannerEditor({
  isSuperAdmin,
  initialBgImage = '',
  initialBadge,
  initialTitle,
  initialDesc,
  initialPromoCode,
  initialPromoDiscount,
}: QuickOfferBannerEditorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [heroBgImage, setHeroBgImage] = useState(initialBgImage);
  const [heroBadge, setHeroBadge] = useState(initialBadge);
  const [heroTitle, setHeroTitle] = useState(initialTitle);
  const [heroDesc, setHeroDesc] = useState(initialDesc);
  const [promoCode, setPromoCode] = useState(initialPromoCode);
  const [promoDiscount, setPromoDiscount] = useState(initialPromoDiscount);

  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  if (!isSuperAdmin) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setHeroBgImage(data.url);
      } else {
        setUploadError(data.error || 'Failed to upload background image');
      }
    } catch {
      setUploadError('Network error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offers_hero_bg_image: heroBgImage,
          offers_hero_badge: heroBadge,
          offers_hero_title: heroTitle,
          offers_hero_desc: heroDesc,
          offers_promo_code: promoCode,
          offers_promo_discount: promoDiscount,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert(data.error || 'Failed to update banner.');
      }
    } catch (err) {
      alert('Network error saving banner text.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Quick Edit Pencil Button on Banner */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-105"
        title="Edit Banner Background Image, Text & Promo Code (Admin)"
      >
        <Edit size={14} className="text-primary" /> Edit Banner & Background
      </button>

      {/* Edit Banner Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 text-left animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white border border-gray-border rounded-2xl p-6 sm:p-8 w-full max-w-xl shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-dark p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary" size={20} />
                <h3 className="text-xl font-extrabold text-dark tracking-tight">Edit Hero Banner & Background</h3>
              </div>
              <p className="text-xs text-gray-text mt-1">
                Customize the background image, banner text, main title, description, and promo coupon code.
              </p>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs font-semibold">
              
              {/* Background Image Controls */}
              <div className="bg-bg-light/60 border border-gray-border p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold text-dark uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-primary" /> Hero Banner Background Image
                  </label>

                  {heroBgImage && (
                    <button
                      type="button"
                      onClick={() => setHeroBgImage('')}
                      className="text-[10px] text-accent-red hover:underline font-bold"
                    >
                      Clear Background Image
                    </button>
                  )}
                </div>

                <Input
                  label="Background Image URL"
                  placeholder="e.g. https://images.unsplash.com/... or upload local file"
                  value={heroBgImage}
                  onChange={(e) => setHeroBgImage(e.target.value)}
                />

                <div className="flex items-center gap-3 pt-1">
                  <label className="cursor-pointer bg-white border border-gray-border hover:border-primary px-3.5 py-2 rounded-lg text-xs font-bold text-dark flex items-center gap-1.5 transition-all select-none hover:text-primary">
                    <UploadCloud size={16} className="text-primary" />
                    {isUploading ? 'Uploading Image...' : 'Upload Background Image File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>

                  {isUploading && <span className="text-[10px] text-gray-text animate-pulse">Uploading...</span>}
                  {uploadError && <span className="text-[10px] text-accent-red font-bold">{uploadError}</span>}
                </div>

                {heroBgImage && (
                  <div className="relative aspect-3/1 bg-gray-900 rounded-lg overflow-hidden border border-gray-200">
                    <img src={heroBgImage} alt="Background Preview" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/50 to-dark/90 flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-dark/70 px-3 py-1 rounded-full">Background Preview</span>
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Hero Top Badge Text"
                placeholder="e.g. SPECIAL STUDIO DEALS & LIMITED OFFERS"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                required
              />

              <Input
                label="Hero Main Title Headline"
                placeholder="e.g. Exclusive Studio Offers & Discounted Packages"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                required
              />

              <Textarea
                label="Hero Banner Description"
                placeholder="Description text explaining studio promotions..."
                value={heroDesc}
                onChange={(e) => setHeroDesc(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Promo Coupon Code"
                  placeholder="e.g. COLORLAB15"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  required
                />

                <Input
                  label="Promo Tagline Text"
                  placeholder="e.g. Get 15% OFF on custom framing packages!"
                  value={promoDiscount}
                  onChange={(e) => setPromoDiscount(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-dark text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isLoading}
                  className="font-bold text-xs px-5 gap-1.5"
                >
                  <Save size={16} /> Save Banner Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
