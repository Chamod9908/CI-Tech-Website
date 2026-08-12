'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Tag, Plus, Edit, Eye, EyeOff, Trash2, Save, X, Sparkles, Gift, Flame } from 'lucide-react';

export interface BundleDeal {
  id: string;
  badge: string;
  badgeColor?: 'emerald' | 'primary' | 'red';
  title: string;
  desc: string;
  originalPrice: number;
  salePrice: number;
  isHidden?: boolean;
  linkUrl?: string;
}

interface OffersManagerProps {
  initialSettings: Record<string, string>;
  initialBundles: BundleDeal[];
  isSuperAdmin: boolean;
}

export default function OffersManager({ initialSettings, initialBundles, isSuperAdmin }: OffersManagerProps) {
  const router = useRouter();

  // Banner states
  const [heroBgImage, setHeroBgImage] = useState(initialSettings.offers_hero_bg_image || '');
  const [heroBadge, setHeroBadge] = useState(initialSettings.offers_hero_badge || 'Special Studio Deals & Limited Offers');
  const [heroTitle, setHeroTitle] = useState(initialSettings.offers_hero_title || 'Exclusive Studio Offers & Discounted Packages');
  const [heroDesc, setHeroDesc] = useState(initialSettings.offers_hero_desc || 'Save big on custom wooden photo framing, high-density photo printing, ceramic mug printing, and corporate gifts.');
  const [promoCode, setPromoCode] = useState(initialSettings.offers_promo_code || 'COLORLAB15');
  const [promoDiscount, setPromoDiscount] = useState(initialSettings.offers_promo_discount || 'Get 15% OFF on custom framing packages!');

  // Bundles state
  const [bundles, setBundles] = useState<BundleDeal[]>(initialBundles);

  // Modal states for creating/editing a bundle
  const [editingBundle, setEditingBundle] = useState<BundleDeal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status feedback
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Bundle form fields
  const [bBadge, setBBadge] = useState('');
  const [bBadgeColor, setBBadgeColor] = useState<'emerald' | 'primary' | 'red'>('emerald');
  const [bTitle, setBTitle] = useState('');
  const [bDesc, setBDesc] = useState('');
  const [bOriginalPrice, setBOriginalPrice] = useState('');
  const [bSalePrice, setBSalePrice] = useState('');
  const [bLinkUrl, setBLinkUrl] = useState('/shop');

  // Open modal for new bundle
  const handleOpenNewBundleModal = () => {
    setEditingBundle(null);
    setBBadge('SAVE 20%');
    setBBadgeColor('emerald');
    setBTitle('');
    setBDesc('');
    setBOriginalPrice('2000');
    setBSalePrice('1600');
    setBLinkUrl('/shop');
    setIsModalOpen(true);
  };

  // Open modal for editing existing bundle
  const handleOpenEditModal = (bundle: BundleDeal) => {
    setEditingBundle(bundle);
    setBBadge(bundle.badge);
    setBBadgeColor(bundle.badgeColor || 'emerald');
    setBTitle(bundle.title);
    setBDesc(bundle.desc);
    setBOriginalPrice(String(bundle.originalPrice));
    setBSalePrice(String(bundle.salePrice));
    setBLinkUrl(bundle.linkUrl || '/shop');
    setIsModalOpen(true);
  };

  // Save changes to DB
  const saveAllOffersData = async (updatedBundles: BundleDeal[]) => {
    setIsSaving(true);
    setFeedbackMsg('');
    setErrorMsg('');

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
          offers_bundles_json: updatedBundles,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackMsg('Offers & Promo settings saved successfully!');
        setBundles(updatedBundles);
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Failed to save offer settings.');
      }
    } catch (err: any) {
      setErrorMsg('Network error updating offers settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save bundle modal form
  const handleSaveBundleModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle.trim() || !bDesc.trim()) {
      alert('Please fill out the bundle title and description.');
      return;
    }

    const orig = Number(bOriginalPrice) || 0;
    const sale = Number(bSalePrice) || 0;

    let newBundlesList: BundleDeal[] = [];

    if (editingBundle) {
      // Modify existing
      newBundlesList = bundles.map((b) =>
        b.id === editingBundle.id
          ? {
              ...b,
              badge: bBadge,
              badgeColor: bBadgeColor,
              title: bTitle,
              desc: bDesc,
              originalPrice: orig,
              salePrice: sale,
              linkUrl: bLinkUrl,
            }
          : b
      );
    } else {
      // Create new
      const newB: BundleDeal = {
        id: 'bundle-' + Date.now(),
        badge: bBadge || 'SPECIAL OFFER',
        badgeColor: bBadgeColor,
        title: bTitle,
        desc: bDesc,
        originalPrice: orig,
        salePrice: sale,
        isHidden: false,
        linkUrl: bLinkUrl,
      };
      newBundlesList = [...bundles, newB];
    }

    setIsModalOpen(false);
    saveAllOffersData(newBundlesList);
  };

  // Toggle Hide / Show Bundle
  const handleToggleHide = (bundleId: string) => {
    const updated = bundles.map((b) =>
      b.id === bundleId ? { ...b, isHidden: !b.isHidden } : b
    );
    saveAllOffersData(updated);
  };

  // Delete Bundle
  const handleDeleteBundle = (bundleId: string) => {
    if (!confirm('Are you sure you want to delete this promotional bundle deal?')) return;
    const updated = bundles.filter((b) => b.id !== bundleId);
    saveAllOffersData(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Offers & Promotional Deals Manager</h1>
          <p className="text-xs sm:text-sm text-gray-text mt-1">
            Configure promotional hero banners, coupon codes, and create or modify special studio bundle packages.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenNewBundleModal}
            className="font-bold text-xs gap-1.5 border-primary text-primary hover:bg-primary/10"
          >
            <Plus size={16} /> Add New Bundle Deal
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => saveAllOffersData(bundles)}
            isLoading={isSaving}
            className="font-bold text-xs gap-1.5"
          >
            <Save size={16} /> Save All Changes
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {feedbackMsg && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-xl text-xs font-bold animate-fade-in">
          {feedbackMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-accent-red border border-red-200 p-4 rounded-xl text-xs font-bold animate-fade-in">
          {errorMsg}
        </div>
      )}

      {/* Section 1: Hero Banner Settings Form */}
      <div className="bg-white border border-gray-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-sm font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center gap-2">
          <Flame className="text-primary" size={18} /> Promotional Header & Coupon Controls
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Hero Background Image URL (Optional)"
            placeholder="e.g. https://images.unsplash.com/..."
            value={heroBgImage}
            onChange={(e) => setHeroBgImage(e.target.value)}
          />

          <Input
            label="Hero Badge Text"
            placeholder="e.g. Special Studio Deals & Limited Offers"
            value={heroBadge}
            onChange={(e) => setHeroBadge(e.target.value)}
          />

          <Input
            label="Hero Title Headline"
            placeholder="e.g. Exclusive Studio Offers & Discounted Packages"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
          />

          <Input
            label="Promo Coupon Code"
            placeholder="e.g. COLORLAB15"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />

          <Input
            label="Promo Coupon Discount Tagline"
            placeholder="e.g. Get 15% OFF on custom framing packages!"
            value={promoDiscount}
            onChange={(e) => setPromoDiscount(e.target.value)}
          />
        </div>

        <Textarea
          label="Hero Description Text"
          placeholder="Detailed promotional banner description text..."
          value={heroDesc}
          onChange={(e) => setHeroDesc(e.target.value)}
        />
      </div>

      {/* Section 2: Special Print Bundles Management */}
      <div className="bg-white border border-gray-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 className="text-sm font-extrabold text-dark uppercase tracking-widest flex items-center gap-2">
            <Gift className="text-primary" size={18} /> Special Print Bundle Deals ({bundles.length})
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenNewBundleModal}
            className="font-bold text-xs gap-1"
          >
            <Plus size={14} /> Add Bundle
          </Button>
        </div>

        {bundles.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-text space-y-2">
            <p className="font-bold">No custom bundle deals created yet.</p>
            <p>Click &quot;Add New Bundle Deal&quot; above to add special packages to the Offers page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <div
                key={bundle.id}
                className={`border rounded-2xl p-5 space-y-4 flex flex-col justify-between relative transition-all ${
                  bundle.isHidden
                    ? 'bg-gray-50 border-dashed border-gray-300 opacity-60'
                    : 'bg-white border-gray-border hover:border-primary shadow-xs'
                }`}
              >
                {/* Admin Quick Action Controls Overlay */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        bundle.badgeColor === 'red'
                          ? 'bg-red-100 text-accent-red'
                          : bundle.badgeColor === 'primary'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {bundle.badge}
                    </span>

                    {bundle.isHidden && (
                      <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                        HIDDEN (ADMIN)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleHide(bundle.id)}
                      className="p-1.5 text-gray-500 hover:text-dark hover:bg-gray-100 rounded-md transition-colors"
                      title={bundle.isHidden ? 'Unhide Bundle' : 'Hide Bundle'}
                    >
                      {bundle.isHidden ? <EyeOff size={14} className="text-red-500" /> : <Eye size={14} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(bundle)}
                      className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                      title="Edit / Modify Bundle"
                    >
                      <Edit size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBundle(bundle.id)}
                      className="p-1.5 text-gray-500 hover:text-accent-red hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Bundle"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Bundle Content */}
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-dark">{bundle.title}</h3>
                  <p className="text-xs text-gray-text leading-relaxed">{bundle.desc}</p>
                </div>

                {/* Pricing & Link */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] line-through text-gray-400 font-semibold block">
                      Rs. {bundle.originalPrice.toLocaleString('en-LK', { minimumFractionDigits: 0 })}
                    </span>
                    <span className="text-sm font-black text-primary">
                      Rs. {bundle.salePrice.toLocaleString('en-LK', { minimumFractionDigits: 0 })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(bundle)}
                    className="px-3 py-1.5 bg-white border border-gray-border hover:border-primary text-dark hover:text-primary text-xs font-bold rounded-lg transition-colors"
                  >
                    Modify
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Creating / Modifying a Bundle Deal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-gray-border rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-dark transition-colors"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-extrabold text-dark tracking-tight">
                {editingBundle ? 'Modify Bundle Deal' : 'Add New Promotional Bundle Deal'}
              </h3>
              <p className="text-xs text-gray-text mt-0.5">
                Set title, offer badge tag, discounted prices, and description for the Offers page.
              </p>
            </div>

            <form onSubmit={handleSaveBundleModal} className="space-y-4">
              <Input
                label="Bundle Package Title"
                placeholder="e.g. Wall Framing Combo Pack"
                value={bTitle}
                onChange={(e) => setBTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Badge Tag Text"
                  placeholder="e.g. SAVE 20%, HOT OFFER"
                  value={bBadge}
                  onChange={(e) => setBBadge(e.target.value)}
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-dark uppercase tracking-wider block">Badge Color</label>
                  <select
                    value={bBadgeColor}
                    onChange={(e: any) => setBBadgeColor(e.target.value)}
                    className="w-full border border-gray-border rounded-lg px-3 py-2 text-xs bg-white text-dark focus:outline-none focus:border-primary font-semibold"
                  >
                    <option value="emerald">Emerald Green (SAVE 20%)</option>
                    <option value="primary">Brand Primary (POPULAR)</option>
                    <option value="red">Red Alert (HOT OFFER)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Original Price (Rs.)"
                  type="number"
                  placeholder="e.g. 4500"
                  value={bOriginalPrice}
                  onChange={(e) => setBOriginalPrice(e.target.value)}
                  required
                />

                <Input
                  label="Offer Sale Price (Rs.)"
                  type="number"
                  placeholder="e.g. 3600"
                  value={bSalePrice}
                  onChange={(e) => setBSalePrice(e.target.value)}
                  required
                />
              </div>

              <Textarea
                label="Bundle Package Description"
                placeholder="Details of what items are included in this bundle deal..."
                value={bDesc}
                onChange={(e) => setBDesc(e.target.value)}
                required
              />

              <Input
                label="Link URL (Target Catalog Page)"
                placeholder="e.g. /shop or /product/photo-frame"
                value={bLinkUrl}
                onChange={(e) => setBLinkUrl(e.target.value)}
              />

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-dark text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>

                <Button type="submit" variant="primary" size="sm" className="font-bold text-xs px-5">
                  Save Bundle Deal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
