export interface SubCategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderIndex: number;
  isEnabled: boolean;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  orderIndex: number;
  isEnabled: boolean;
  subCategories?: SubCategoryData[];
}

export const categories: CategoryData[] = [
  {
    id: 'cat-photo-printing',
    name: 'Photo Printing',
    slug: 'photo-printing',
    description: 'Professional high-definition photo print lab services',
    imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400',
    orderIndex: 1,
    isEnabled: true,
  },
  {
    id: 'cat-photo-print-and-frame-complete',
    name: 'Photo Print & Frame ( Complete)',
    slug: 'photo-print-and-frame-complete',
    description: 'Complete custom photo prints framed in glass, wood, black, white, box, and ply mount finishes',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400',
    orderIndex: 2,
    isEnabled: true,
  },
  {
    id: 'cat-photo-editing-and-retouching',
    name: 'Photo Editing & Retouching',
    slug: 'photo-editing-and-retouching',
    description: 'Professional digital photo retouching, restoration, background removal, and colorization services',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-3a317272018a?auto=format&fit=crop&q=80&w=400',
    orderIndex: 3,
    isEnabled: true,
  },
  {
    id: 'cat-photo-restoration',
    name: 'Photo Restoration',
    slug: 'photo-restoration',
    description: 'Professional restoration of old, damaged, faded, or low-quality photos with natural-looking results',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=400',
    orderIndex: 4,
    isEnabled: true,
  },
  {
    id: 'cat-graphic-design',
    name: 'Graphic Design',
    slug: 'graphic-design',
    description: 'Custom professional graphic design, logos, flyers, banners, social media posts, and branding materials',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400',
    orderIndex: 5,
    isEnabled: true,
  },
  {
    id: 'cat-photocopy-and-printouts',
    name: 'Photocopy & Printouts',
    slug: 'photocopy-and-printouts',
    description: 'Fast document photocopying, color/black & white printing in A4 and A3 sizes, single & double sided',
    imageUrl: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=400',
    orderIndex: 6,
    isEnabled: true,
  },
  {
    id: 'cat-photo-frames',
    name: 'Photo Frames',
    slug: 'photo-frames',
    description: 'Premium custom wooden, black, and white glass frames',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400',
    orderIndex: 7,
    isEnabled: true,
  },
  {
    id: 'cat-mug-printing',
    name: 'Mug Printing',
    slug: 'mug-printing',
    description: 'Personalized designs printed on ceramic mugs',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400',
    orderIndex: 8,
    isEnabled: true,
  },
  {
    id: 'cat-personalized-gifts',
    name: 'Personalized Gifts',
    slug: 'personalized-gifts',
    description: 'Custom printed shirts, keytags, crystals, and wood crafts',
    imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=400',
    orderIndex: 9,
    isEnabled: true,
  },
  {
    id: 'cat-business-printing',
    name: 'Business Printing',
    slug: 'business-printing',
    description: 'Business cards, stickers, labels, and promotional materials',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400',
    orderIndex: 10,
    isEnabled: true,
  },
  {
    id: 'cat-canvas-and-collages',
    name: 'Canvas & Collages',
    slug: 'canvas-and-collages',
    description: 'Large canvas prints and custom multi-photo layouts',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=400',
    orderIndex: 11,
    isEnabled: true,
  },
];
