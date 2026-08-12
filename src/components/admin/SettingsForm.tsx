'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Save, Check, AlertCircle, UploadCloud, Plus, Trash2 } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface SettingsFormProps {
  initialSettings: Record<string, string>;
  initialFaqs: FaqItem[];
}

export default function SettingsForm({ initialSettings, initialFaqs }: SettingsFormProps) {
  // Form states
  const [siteName, setSiteName] = useState(initialSettings.site_name || '');
  const [brandHashtag, setBrandHashtag] = useState(initialSettings.brand_hashtag || '');
  const [logoImageUrl, setLogoImageUrl] = useState(initialSettings.logo_image_url || '');
  const [announcementBar, setAnnouncementBar] = useState(initialSettings.announcement_bar || '');
  
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState('');
  
  const [contactEmail, setContactEmail] = useState(initialSettings.contact_email || '');
  const [contactPhone, setContactPhone] = useState(initialSettings.contact_phone || '');
  const [contactWhatsapp, setContactWhatsapp] = useState(initialSettings.contact_whatsapp || '');
  const [storeAddress, setStoreAddress] = useState(initialSettings.store_address || '');
  const [openingHours, setOpeningHours] = useState(initialSettings.opening_hours || '');
  
  const [bankDetailsTransfer, setBankDetailsTransfer] = useState(initialSettings.bank_details_transfer || '');
  const [paymentApiKey, setPaymentApiKey] = useState(initialSettings.payment_api_key || '');
  const [paymentSecret, setPaymentSecret] = useState(initialSettings.payment_secret || '');

  // Storefront Layout Customizer States
  const [heroTitle, setHeroTitle] = useState(initialSettings.hero_title || '');
  const [heroSubtitle, setHeroSubtitle] = useState(initialSettings.hero_subtitle || '');
  const [heroImageUrl, setHeroImageUrl] = useState(initialSettings.hero_image_url || '');
  const [primaryColor, setPrimaryColor] = useState(initialSettings.primary_color || '#f97316');
  const [announcementBarBg, setAnnouncementBarBg] = useState(initialSettings.announcement_bar_bg || '#f97316');

  // Hero Featured 3D Promo Card states
  const [heroBadgeText, setHeroBadgeText] = useState(initialSettings.hero_badge_text || 'BEST SELLER');
  const [heroBadgeBg, setHeroBadgeBg] = useState(initialSettings.hero_badge_bg || '#ef4444');
  const [heroPromoTitle, setHeroPromoTitle] = useState(initialSettings.hero_promo_title || 'Custom Stickers & Labels');
  const [heroPromoCategory, setHeroPromoCategory] = useState(initialSettings.hero_promo_category || 'BUSINESS PRINTING');
  const [heroPromoPrice, setHeroPromoPrice] = useState(initialSettings.hero_promo_price || 'Rs. 1,200.00');
  const [heroPromoDesc, setHeroPromoDesc] = useState(initialSettings.hero_promo_desc || 'Custom Custom Stickers & Labels made premium in Sri Lanka.');
  const [heroPromoImage, setHeroPromoImage] = useState(initialSettings.hero_promo_image || '');

  const [isUploadingPromoImage, setIsUploadingPromoImage] = useState(false);
  const [promoImageUploadError, setPromoImageUploadError] = useState('');

  // Product Grid Action Button customizer state
  const [productCardBtnText, setProductCardBtnText] = useState(initialSettings.product_card_btn_text || 'Create Your Own');

  // Premium Studio Standards customizer states
  const [standardsTitle, setStandardsTitle] = useState(initialSettings.standards_title || 'Premium Studio Standards Since Day One');
  const [standardsDesc, setStandardsDesc] = useState(initialSettings.standards_desc || 'At C.I. Technologies & Color Lab, we use high-density printing machinery...');
  const [standardsPoints, setStandardsPoints] = useState(initialSettings.standards_points || 'Advanced Color Correction, Moisture Resistant Coating, Multi-Layer Quality Auditing, Safe Packaging (Wood Frames)');
  const [standardsImageUrl, setStandardsImageUrl] = useState(initialSettings.standards_image_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600');

  // FAQs state
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);

  // Upload states
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaUploadError, setMediaUploadError] = useState('');
  const [isUploadingStandards, setIsUploadingStandards] = useState(false);
  const [standardsUploadError, setStandardsUploadError] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    setLogoUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLogoImageUrl(data.url);
      } else {
        setLogoUploadError(data.error || 'Failed to upload logo image');
      }
    } catch {
      setLogoUploadError('Network error uploading file');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    setMediaUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setHeroImageUrl(data.url);
      } else {
        setMediaUploadError(data.error || 'Failed to upload media file');
      }
    } catch {
      setMediaUploadError('Network error uploading file');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleStandardsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingStandards(true);
    setStandardsUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStandardsImageUrl(data.url);
      } else {
        setStandardsUploadError(data.error || 'Failed to upload image file');
      }
    } catch {
      setStandardsUploadError('Network error uploading file');
    } finally {
      setIsUploadingStandards(false);
    }
  };

  const handlePromoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPromoImage(true);
    setPromoImageUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setHeroPromoImage(data.url);
      } else {
        setPromoImageUploadError(data.error || 'Failed to upload card image');
      }
    } catch {
      setPromoImageUploadError('Network error uploading file');
    } finally {
      setIsUploadingPromoImage(false);
    }
  };

  // FAQ logic
  const handleAddFaq = () => {
    setFaqs([...faqs, { id: 'new-' + Date.now(), question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqQuestionChange = (index: number, val: string) => {
    const next = [...faqs];
    next[index].question = val;
    setFaqs(next);
  };

  const handleFaqAnswerChange = (index: number, val: string) => {
    const next = [...faqs];
    next[index].answer = val;
    setFaqs(next);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_name: siteName,
          brand_hashtag: brandHashtag,
          logo_image_url: logoImageUrl,
          announcement_bar: announcementBar,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          contact_whatsapp: contactWhatsapp,
          store_address: storeAddress,
          opening_hours: openingHours,
          bank_details_transfer: bankDetailsTransfer,
          payment_api_key: paymentApiKey,
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          hero_image_url: heroImageUrl,
          hero_badge_text: heroBadgeText,
          hero_badge_bg: heroBadgeBg,
          hero_promo_title: heroPromoTitle,
          hero_promo_category: heroPromoCategory,
          hero_promo_price: heroPromoPrice,
          hero_promo_desc: heroPromoDesc,
          hero_promo_image: heroPromoImage,
          product_card_btn_text: productCardBtnText,
          primary_color: primaryColor,
          announcement_bar_bg: announcementBarBg,
          standards_title: standardsTitle,
          standards_desc: standardsDesc,
          standards_points: standardsPoints,
          standards_image_url: standardsImageUrl,
          faqs,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Settings and FAQs saved successfully.');
        setTimeout(() => {
          setSuccessMsg('');
          window.location.reload();
        }, 1500);
      } else {
        setErrorMsg(data.error || 'Failed to save settings.');
      }
    } catch {
      setErrorMsg('A network error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      
      {/* 1. Branding Settings */}
      <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-1">Branding</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Business Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            required
          />
          <Input
            label="Brand Hashtag"
            value={brandHashtag}
            onChange={(e) => setBrandHashtag(e.target.value)}
            required
          />
        </div>
        
        {/* Logo Uploader */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-bg-light/40 border border-gray-border p-4 rounded-xl">
          <div className="space-y-2">
            <Input
              label="Logo Image URL"
              placeholder="e.g. /secure_uploads/... or external link"
              value={logoImageUrl}
              onChange={(e) => setLogoImageUrl(e.target.value)}
            />
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[10px] font-bold text-dark uppercase tracking-wider block">Upload Logo Image (JPG/PNG/WEBP/SVG)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-white border border-gray-border hover:border-primary px-4 py-2 rounded-lg text-xs font-bold text-dark flex items-center gap-1.5 transition-all select-none hover:text-primary">
                  <UploadCloud size={16} className="text-primary" />
                  {isUploadingLogo ? 'Uploading...' : 'Choose File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={isUploadingLogo}
                  />
                </label>
                {isUploadingLogo && <span className="text-[10px] text-gray-text animate-pulse">Uploading...</span>}
                {logoUploadError && <span className="text-[10px] text-accent-red font-bold">{logoUploadError}</span>}
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="w-32 h-16 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0 p-2">
              {logoImageUrl ? (
                <img src={logoImageUrl} alt="Logo Preview" className="h-full object-contain" />
              ) : (
                <span className="text-[10px] text-gray-text text-center">No Logo Uploaded</span>
              )}
            </div>
          </div>
        </div>
        <Input
          label="Announcement Bar Text"
          value={announcementBar}
          onChange={(e) => setAnnouncementBar(e.target.value)}
        />
      </div>

      {/* 2. Storefront Layout & Visual Theme Customizer */}
      <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-1">Storefront Design & Customizer</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Color pickers */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-dark uppercase tracking-wider block">Primary Brand Theme Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-10 border border-gray-border rounded cursor-pointer p-0.5 bg-white"
              />
              <span className="text-xs font-bold text-dark font-mono uppercase">{primaryColor}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-dark uppercase tracking-wider block">Announcement Bar Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={announcementBarBg}
                onChange={(e) => setAnnouncementBarBg(e.target.value)}
                className="w-12 h-10 border border-gray-border rounded cursor-pointer p-0.5 bg-white"
              />
              <span className="text-xs font-bold text-dark font-mono uppercase">{announcementBarBg}</span>
            </div>
          </div>
        </div>

        <Input
          label="Product Grid Action Button Label"
          placeholder="e.g. Create Your Own (Default), Customize, Order Now"
          value={productCardBtnText}
          onChange={(e) => setProductCardBtnText(e.target.value)}
        />

        <Input
          label="Homepage Hero Title"
          placeholder="e.g. Print Your Memories. Create Something Special."
          value={heroTitle}
          onChange={(e) => setHeroTitle(e.target.value)}
        />

        <Textarea
          label="Homepage Hero Subtitle"
          placeholder="e.g. Professional photo printing, custom wooden framing..."
          value={heroSubtitle}
          onChange={(e) => setHeroSubtitle(e.target.value)}
        />

        {/* Hero Background Media Upload (Image or Video) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-bg-light/40 border border-gray-border p-4 rounded-xl">
          <div className="space-y-2">
            <Input
              label="Homepage Hero Background (Image/Video URL)"
              placeholder="e.g. /secure_uploads/... or external link"
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
            />
            
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[10px] font-bold text-dark uppercase tracking-wider block">Upload Image or Video (MP4/WEBP/JPG/PNG)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-white border border-gray-border hover:border-primary px-4 py-2 rounded-lg text-xs font-bold text-dark flex items-center gap-1.5 transition-all select-none hover:text-primary">
                  <UploadCloud size={16} className="text-primary" />
                  {isUploadingMedia ? 'Uploading...' : 'Choose File'}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    disabled={isUploadingMedia}
                  />
                </label>
                {isUploadingMedia && <span className="text-[10px] text-gray-text animate-pulse">Uploading...</span>}
                {mediaUploadError && <span className="text-[10px] text-accent-red font-bold">{mediaUploadError}</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-32 h-32 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              {heroImageUrl ? (
                heroImageUrl.endsWith('.mp4') || heroImageUrl.endsWith('.webm') ? (
                  <video src={heroImageUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <img src={heroImageUrl} alt="Preview" className="w-full h-full object-cover" />
                )
              ) : (
                <span className="text-[10px] text-gray-text text-center px-2">No Media Selected</span>
              )}
            </div>
          </div>
        </div>

        {/* Hero 3D Showcase Card Customizer Sub-Block */}
        <div className="pt-6 border-t border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold text-dark uppercase tracking-wider">Featured Hero Card (3D Promo Card)</h4>
              <p className="text-[11px] text-gray-text">Customize the badge, text, price, category tag, and image of the featured promo card on the homepage hero banner.</p>
            </div>
            <span className="text-[10px] bg-primary/10 text-primary font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Live Card Editor</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Card Badge Label Text"
              placeholder="e.g. BEST SELLER, NEW, 20% OFF, POPULAR, HOT"
              value={heroBadgeText}
              onChange={(e) => setHeroBadgeText(e.target.value)}
            />

            <div>
              <label className="text-xs font-bold text-dark block mb-1">Card Badge Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={heroBadgeBg}
                  onChange={(e) => setHeroBadgeBg(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-gray-border p-0.5"
                />
                <Input
                  value={heroBadgeBg}
                  onChange={(e) => setHeroBadgeBg(e.target.value)}
                  placeholder="#ef4444"
                  className="flex-1"
                />
              </div>
            </div>

            <Input
              label="Card Product Title"
              placeholder="e.g. Custom Stickers & Labels"
              value={heroPromoTitle}
              onChange={(e) => setHeroPromoTitle(e.target.value)}
            />

            <Input
              label="Card Category Label"
              placeholder="e.g. BUSINESS PRINTING"
              value={heroPromoCategory}
              onChange={(e) => setHeroPromoCategory(e.target.value)}
            />

            <Input
              label="Card Display Price"
              placeholder="e.g. Rs. 1,200.00"
              value={heroPromoPrice}
              onChange={(e) => setHeroPromoPrice(e.target.value)}
            />

            <Input
              label="Card Subtitle / Feature Line"
              placeholder="e.g. High Quality • Durable • Custom Designed"
              value={heroPromoDesc}
              onChange={(e) => setHeroPromoDesc(e.target.value)}
            />
          </div>

          {/* Promo Card Image Uploader & Live Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-bg-light/40 border border-gray-border p-4 rounded-xl mt-2">
            <div className="space-y-2">
              <Input
                label="Card Display Image URL"
                placeholder="e.g. /secure_uploads/... or external image link"
                value={heroPromoImage}
                onChange={(e) => setHeroPromoImage(e.target.value)}
              />
              
              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-[10px] font-bold text-dark uppercase tracking-wider block">Upload Card Image (PNG/JPG/WEBP)</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-white border border-gray-border hover:border-primary px-4 py-2 rounded-lg text-xs font-bold text-dark flex items-center gap-1.5 transition-all select-none hover:text-primary">
                    <UploadCloud size={16} className="text-primary" />
                    {isUploadingPromoImage ? 'Uploading...' : 'Choose File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePromoImageUpload}
                      className="hidden"
                      disabled={isUploadingPromoImage}
                    />
                  </label>
                  {isUploadingPromoImage && <span className="text-[10px] text-gray-text animate-pulse">Uploading...</span>}
                  {promoImageUploadError && <span className="text-[10px] text-accent-red font-bold">{promoImageUploadError}</span>}
                </div>
              </div>
            </div>

            {/* Live Card Preview */}
            <div className="flex justify-center md:justify-end">
              <div className="w-56 bg-soft-dark border border-gray-800 rounded-xl p-3 shadow-md text-white space-y-2">
                <div className="w-full h-32 bg-gray-900 rounded-lg overflow-hidden relative border border-gray-800 flex items-center justify-center">
                  {heroPromoImage ? (
                    <img src={heroPromoImage} alt="Card Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-gray-400">Default Product Image</span>
                  )}
                  <div
                    className="absolute top-1.5 right-1.5 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase shadow-xs tracking-wider"
                    style={{ backgroundColor: heroBadgeBg }}
                  >
                    {heroBadgeText || 'BEST SELLER'}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[8px] text-primary font-bold uppercase tracking-wider truncate">{heroPromoCategory || 'BUSINESS PRINTING'}</p>
                  <h5 className="font-extrabold text-white text-xs truncate">{heroPromoTitle || 'Custom Stickers & Labels'}</h5>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-white">{heroPromoPrice || 'Rs. 1,200.00'}</span>
                    <span className="text-[8px] text-gray-400 truncate max-w-[80px]">{heroPromoDesc || 'High Quality'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Premium Studio Standards Customizer */}
      <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-1">Homepage Studio Standards Block</h3>
        
        <Input
          label="Standards Section Title"
          placeholder="e.g. Premium Studio Standards Since Day One"
          value={standardsTitle}
          onChange={(e) => setStandardsTitle(e.target.value)}
          required
        />

        <Textarea
          label="Standards Section Description"
          placeholder="Detailed paragraphs explaining color printing machinery, wood frames..."
          value={standardsDesc}
          onChange={(e) => setStandardsDesc(e.target.value)}
          required
        />

        <Input
          label="Standards bullet points (Comma Separated)"
          placeholder="e.g. Advanced Color Correction, Moisture Resistant Coating, Safe Packaging (Wood Frames)"
          value={standardsPoints}
          onChange={(e) => setStandardsPoints(e.target.value)}
          required
        />

        {/* Standards Image upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-bg-light/40 border border-gray-border p-4 rounded-xl">
          <div className="space-y-2">
            <Input
              label="Standards Block Display Image URL"
              placeholder="e.g. /secure_uploads/... or external link"
              value={standardsImageUrl}
              onChange={(e) => setStandardsImageUrl(e.target.value)}
              required
            />
            
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[10px] font-bold text-dark uppercase tracking-wider block">Upload Image (JPG/PNG/WEBP)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-white border border-gray-border hover:border-primary px-4 py-2 rounded-lg text-xs font-bold text-dark flex items-center gap-1.5 transition-all select-none hover:text-primary">
                  <UploadCloud size={16} className="text-primary" />
                  {isUploadingStandards ? 'Uploading...' : 'Choose File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleStandardsUpload}
                    className="hidden"
                    disabled={isUploadingStandards}
                  />
                </label>
                {isUploadingStandards && <span className="text-[10px] text-gray-text animate-pulse">Uploading...</span>}
                {standardsUploadError && <span className="text-[10px] text-accent-red font-bold">{standardsUploadError}</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-32 h-32 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              {standardsImageUrl ? (
                <img src={standardsImageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-gray-text text-center px-2">No Image Selected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Frequently Asked Questions FAQ Editor */}
      <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest">Frequently Asked Questions (FAQ) Editor</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddFaq} className="text-xs font-bold gap-1 py-1">
            <Plus size={14} /> Add FAQ Item
          </Button>
        </div>

        {faqs.length === 0 ? (
          <p className="text-xs text-gray-text italic">No FAQs configured. Click &quot;Add FAQ Item&quot; to create one.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={faq.id} className="border border-gray-200 rounded-xl p-4 bg-bg-light/40 space-y-3">
                <div className="flex justify-between items-center gap-4 border-b border-gray-150 pb-1">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider">FAQ Item #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="text-gray-text hover:text-accent-red p-1 hover:bg-gray-100 rounded transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <Input
                  label="Question"
                  placeholder="e.g. How long does delivery take?"
                  value={faq.question}
                  onChange={(e) => handleFaqQuestionChange(idx, e.target.value)}
                  required
                />
                <Textarea
                  label="Answer"
                  placeholder="e.g. Standard delivery takes 2-3 business days..."
                  value={faq.answer}
                  onChange={(e) => handleFaqAnswerChange(idx, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Contact Coordinates */}
      <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-1">Contact & Public Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Public Email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
          />
          <Input
            label="Public Phone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
          />
          <Input
            label="WhatsApp Number (With Country Code)"
            value={contactWhatsapp}
            onChange={(e) => setContactWhatsapp(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Physical Store Address"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            required
          />
          <Input
            label="Opening Hours Description"
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
            required
          />
        </div>
      </div>

      {/* 6. Payments Configurations */}
      <div className="bg-white border border-gray-border rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-dark uppercase tracking-widest border-b border-gray-100 pb-1">Payments & Gateway Credentials</h3>
        <Textarea
          label="Bank Transfer Instructions"
          value={bankDetailsTransfer}
          onChange={(e) => setBankDetailsTransfer(e.target.value)}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Online Gateway API Key (Placeholder)"
            type="password"
            value={paymentApiKey}
            onChange={(e) => setPaymentApiKey(e.target.value)}
          />
          <Input
            label="Online Gateway Secret (Placeholder)"
            type="password"
            value={paymentSecret}
            onChange={(e) => setPaymentSecret(e.target.value)}
          />
        </div>
      </div>

      {/* Feedback Messages */}
      {errorMsg && (
        <div className="bg-red-50 text-accent-red border border-red-100 p-3 rounded-lg text-xs font-semibold flex items-center gap-1.5">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg text-xs font-semibold flex items-center gap-1.5">
          <Check size={16} className="bg-green-700 text-white rounded-full p-0.5" /> {successMsg}
        </div>
      )}

      {/* Save Button */}
      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="font-bold text-xs"
          isLoading={isSaving}
        >
          Save Site Settings <Save size={16} />
        </Button>
      </div>

    </form>
  );
}
