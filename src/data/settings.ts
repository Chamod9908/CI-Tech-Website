export interface SiteSettings {
  [key: string]: string | undefined;
  site_name: string;
  brand_hashtag: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  store_address: string;
  opening_hours: string;
  bank_details_transfer: string;
  announcement_bar: string;
  social_facebook: string;
  social_instagram: string;
  social_tiktok: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_url?: string;
  hero_badge_text?: string;
  hero_badge_bg?: string;
  hero_promo_title?: string;
  hero_promo_category?: string;
  hero_promo_price?: string;
  hero_promo_image?: string;
  hero_promo_desc?: string;
  product_card_btn_text?: string;
  standards_title?: string;
  standards_desc?: string;
  standards_points?: string;
  standards_image_url?: string;
}

export const siteSettings: SiteSettings = {
  site_name: 'C.I. Technologies & Color Lab',
  brand_hashtag: '#colorlab99',
  contact_email: 'info@colorlab99.lk',
  contact_phone: '+94 77 123 4567',
  contact_whatsapp: '+94 77 123 4567',
  store_address: '99 Main Street, Colombo, Sri Lanka',
  opening_hours: 'Monday - Saturday: 8.30 AM - 7.00 PM | Sunday: 9.00 AM - 2.00 PM',
  bank_details_transfer: 'Commercial Bank | C.I. Technologies | Account: 1234567890 | Branch: Colombo Fort',
  announcement_bar: 'Premium Printing & Color Lab Services | Islandwide Delivery Available',
  social_facebook: 'https://facebook.com/colorlab99',
  social_instagram: 'https://instagram.com/colorlab99',
  social_tiktok: 'https://tiktok.com/@colorlab99',
  hero_title: 'Print Your Memories. Create Something Special.',
  hero_subtitle: 'Professional photo printing, high-end color studio lab services, customized mugs, custom premium photo framing, and corporate digital printing. Bring your photos to life with vivid color accuracy.',
  hero_image_url: '',
  hero_badge_text: 'Best Seller',
  hero_badge_bg: '#ef4444',
  hero_promo_title: 'Custom Photo Frame',
  hero_promo_category: 'Photo Frames',
  hero_promo_price: 'Rs. 1,200.00',
  hero_promo_image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400',
  hero_promo_desc: 'High Quality • Premium Finish',
  product_card_btn_text: 'Create Your Own',
  standards_title: 'Premium Studio Standards Since Day One',
  standards_desc: 'At C.I. Technologies & Color Lab, we use high-density printing machinery to guarantee precise details, deep blacks, and rich vibrant colors. We use authentic wooden framing materials and anti-glare matt glass to elevate your spaces.',
  standards_points: 'Advanced Color Correction, Moisture Resistant Coating, Multi-Layer Quality Auditing, Safe Packaging (Wood Frames)',
  standards_image_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600',
};

export function getSiteSetting(key: keyof SiteSettings, defaultValue = ''): string {
  return siteSettings[key] || defaultValue;
}

export function getAllSiteSettings(): Record<string, string> {
  return siteSettings as unknown as Record<string, string>;
}
