export interface OfferData {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  badge?: string;
  discountPercentage?: number;
  promoCode?: string;
  ctaText?: string;
  ctaLink?: string;
  validUntil?: string;
}

export const offers: OfferData[] = [
  {
    id: 'offer-1',
    title: 'Custom Photo Framing Combo Package',
    description: 'Get 15% OFF when ordering 2 or more complete photo print & frame packages.',
    bannerUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=800',
    badge: 'Special Offer',
    discountPercentage: 15,
    promoCode: 'FRAME15',
    ctaText: 'Shop Framing Combo',
    ctaLink: '/shop?category=photo-frames',
    validUntil: 'Limited Time Offer',
  },
  {
    id: 'offer-2',
    title: 'Personalized Mug Gift Set',
    description: 'Buy 2 Magic Mugs or Customized Ceramic Mugs & Get Free Gift Box Packaging.',
    bannerUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    badge: 'Best Value',
    discountPercentage: 10,
    promoCode: 'MUGDEAL',
    ctaText: 'Customize Mug',
    ctaLink: '/shop?category=mug-printing',
    validUntil: 'Available Now',
  },
];
