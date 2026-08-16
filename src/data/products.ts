export interface ProductOptionValueData {
  id?: string;
  value: string;
  priceAdjustment: number;
}

export interface ProductOptionData {
  id?: string;
  name: string;
  isRequired?: boolean;
  values: ProductOptionValueData[];
}

export interface ProductImageData {
  id?: string;
  url: string;
  orderIndex?: number;
}

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  category?: { name: string; slug: string };
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number | null;
  isFeatured?: boolean;
  isActive?: boolean;
  images: ProductImageData[];
  options?: ProductOptionData[];
}

export const products: ProductData[] = [
  {
    id: 'prod-frame-001',
    name: 'Custom Photo Frame',
    slug: 'custom-photo-frame',
    sku: 'CI-FRAME-001',
    categoryId: 'cat-photo-frames',
    categoryName: 'Photo Frames',
    categorySlug: 'photo-frames',
    description: 'Design and preview your custom wooden or synthetic photo frames. Includes premium glass options.',
    shortDescription: 'Custom frames available in multiple sizes and colors.',
    price: 1200.00,
    isFeatured: true,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
    ],
    options: [
      {
        name: 'Size',
        isRequired: true,
        values: [
          { value: '4x6 inches', priceAdjustment: 0.00 },
          { value: '6x8 inches', priceAdjustment: 150.00 },
          { value: '8x12 inches', priceAdjustment: 350.00 },
          { value: '10x15 inches', priceAdjustment: 600.00 },
          { value: '12x18 inches', priceAdjustment: 900.00 },
        ],
      },
      {
        name: 'Border Type',
        isRequired: true,
        values: [
          { value: 'Black Minimal', priceAdjustment: 0.00 },
          { value: 'White Minimal', priceAdjustment: 0.00 },
          { value: 'Teak Wood Finish', priceAdjustment: 200.00 },
          { value: 'Antique Gold', priceAdjustment: 300.00 },
        ],
      },
      {
        name: 'Glass Protection',
        isRequired: true,
        values: [
          { value: 'Normal Clear Glass', priceAdjustment: 0.00 },
          { value: 'Matt / Anti-Glare Glass', priceAdjustment: 180.00 },
          { value: 'No Glass (Board Only)', priceAdjustment: -100.00 },
        ],
      },
    ],
  },
  {
    id: 'prod-mug-001',
    name: 'Personalized Photo Mug',
    slug: 'personalized-photo-mug',
    sku: 'CI-MUG-001',
    categoryId: 'cat-mug-printing',
    categoryName: 'Mug Printing',
    categorySlug: 'mug-printing',
    description: 'Your favorite photos printed beautifully on high-quality ceramic mugs. Dishwasher and microwave safe.',
    shortDescription: 'High-quality personalized mugs for gifts.',
    price: 950.00,
    isFeatured: true,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
    ],
    options: [
      {
        name: 'Mug Variant',
        isRequired: true,
        values: [
          { value: 'Standard White Mug', priceAdjustment: 0.00 },
          { value: 'Color Changing Magic Mug', priceAdjustment: 300.00 },
          { value: 'Glitter Gold Mug', priceAdjustment: 200.00 },
          { value: 'Inner Color Mug (Red/Blue)', priceAdjustment: 100.00 },
        ],
      },
    ],
  },
  {
    id: 'prod-pp-01',
    name: '4x4 Photo Print & Lamination',
    slug: '4x4-photo-print-lamination',
    sku: 'CI-PP-01',
    categoryId: 'cat-photo-printing',
    categoryName: 'Photo Printing',
    categorySlug: 'photo-printing',
    description: '4x4 inch photo print produced on high-quality photo paper with sharp details and vibrant colors.',
    shortDescription: 'High-quality 4x4 inch photo print with professional lamination options.',
    price: 40.00,
    isFeatured: true,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
    ],
    options: [
      {
        name: 'Lamination Type',
        isRequired: true,
        values: [
          { value: 'None (No Lamination)', priceAdjustment: 0.00 },
          { value: 'Hot Lamination', priceAdjustment: 20.00 },
          { value: 'Cold Lamination (Matt)', priceAdjustment: 25.00 },
          { value: 'Silver Lamination (Shine)', priceAdjustment: 25.00 },
          { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 30.00 },
        ],
      },
    ],
  },
  {
    id: 'prod-pp-02',
    name: '4x6 Photo Print & Lamination',
    slug: '4x6-photo-print-lamination',
    sku: 'CI-PP-02',
    categoryId: 'cat-photo-printing',
    categoryName: 'Photo Printing',
    categorySlug: 'photo-printing',
    description: 'Standard 4x6 inch photo print produced on professional photographic paper.',
    shortDescription: 'Standard 4x6 photo print with custom lamination options.',
    price: 50.00,
    isFeatured: true,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
    ],
    options: [
      {
        name: 'Lamination Type',
        isRequired: true,
        values: [
          { value: 'None (No Lamination)', priceAdjustment: 0.00 },
          { value: 'Hot Lamination', priceAdjustment: 100.00 },
          { value: 'Cold Lamination (Matt)', priceAdjustment: 100.00 },
          { value: 'Silver Lamination (Shine)', priceAdjustment: 175.00 },
          { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 200.00 },
        ],
      },
    ],
  },
  {
    id: 'prod-pp-04',
    name: '5x7 Photo Print & Lamination',
    slug: '5x7-photo-print-lamination',
    sku: 'CI-PP-04',
    categoryId: 'cat-photo-printing',
    categoryName: 'Photo Printing',
    categorySlug: 'photo-printing',
    description: 'Classic 5x7 inch photo print with vivid colors and sharp details.',
    shortDescription: 'Classic 5x7 photo print with custom lamination choices.',
    price: 80.00,
    isFeatured: true,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
    ],
    options: [
      {
        name: 'Lamination Type',
        isRequired: true,
        values: [
          { value: 'None (No Lamination)', priceAdjustment: 0.00 },
          { value: 'Hot Lamination', priceAdjustment: 170.00 },
          { value: 'Cold Lamination (Matt)', priceAdjustment: 170.00 },
          { value: 'Silver Lamination (Shine)', priceAdjustment: 320.00 },
          { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 350.00 },
        ],
      },
    ],
  },
  {
    id: 'prod-pp-07',
    name: '8x12 Photo Print & Lamination',
    slug: '8x12-photo-print-lamination',
    sku: 'CI-PP-07',
    categoryId: 'cat-photo-printing',
    categoryName: 'Photo Printing',
    categorySlug: 'photo-printing',
    description: 'Full 8x12 photo print size. Perfect for framing or album preservation with custom hot, cold matt, silver shine, or crystal glass-look finishes.',
    shortDescription: 'Full 8x12 photo print with lamination options.',
    price: 200.00,
    isFeatured: true,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
    ],
    options: [
      {
        name: 'Lamination Type',
        isRequired: true,
        values: [
          { value: 'None (No Lamination)', priceAdjustment: 0.00 },
          { value: 'Hot Lamination', priceAdjustment: 200.00 },
          { value: 'Cold Lamination (Matt)', priceAdjustment: 400.00 },
          { value: 'Silver Lamination (Shine)', priceAdjustment: 430.00 },
          { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 480.00 },
        ],
      },
    ],
  },
  {
    id: 'prod-doc-main',
    name: 'Photocopy & Printout Services',
    slug: 'photocopy-and-printout-services',
    sku: 'CI-DOC-MAIN',
    categoryId: 'cat-photocopy-and-printouts',
    categoryName: 'Photocopy & Printouts',
    categorySlug: 'photocopy-and-printouts',
    description: 'Fast and high quality document photocopying and printing in A4 & A3 sizes, B&W or vibrant color, single or double sided.',
    shortDescription: 'Document photocopying & laser printing services in A4 & A3 sizes.',
    price: 10.00,
    isFeatured: true,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
    ],
    options: [
      {
        name: 'SERVICE TYPE',
        isRequired: true,
        values: [
          { value: 'A4 Black & White Photocopy – Single Side', priceAdjustment: 0.00 },
          { value: 'A4 Black & White Printout', priceAdjustment: 0.00 },
          { value: 'A4 Black & White Photocopy – Double Side', priceAdjustment: 5.00 },
          { value: 'A3 Black & White Photocopy – Single Side', priceAdjustment: 10.00 },
          { value: 'A3 Black & White Printout', priceAdjustment: 10.00 },
          { value: 'A3 Black & White Photocopy – Double Side', priceAdjustment: 20.00 },
          { value: 'A4 Colour Photocopy – Single Side', priceAdjustment: 40.00 },
          { value: 'A4 Colour Printout', priceAdjustment: 40.00 },
          { value: 'A4 Colour Photocopy – Double Side', priceAdjustment: 70.00 },
          { value: 'A3 Colour Photocopy – Single Side', priceAdjustment: 90.00 },
          { value: 'A3 Colour Printout', priceAdjustment: 90.00 },
          { value: 'A3 Colour Photocopy – Double Side', priceAdjustment: 140.00 },
        ],
      },
    ],
  },
  {
    id: 'prod-canvas-001',
    name: 'Premium Canvas Print',
    slug: 'canvas-print',
    sku: 'CI-CANVAS-001',
    categoryId: 'cat-canvas-and-collages',
    categoryName: 'Canvas & Collages',
    categorySlug: 'canvas-and-collages',
    description: 'High definition gallery wrapped canvas prints stretched over solid wooden stretcher bars.',
    shortDescription: 'Custom museum-quality canvas prints.',
    price: 3800.00,
    isFeatured: true,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
    ],
  },
  {
    id: 'prod-sticker-001',
    name: 'Custom Stickers & Labels',
    slug: 'custom-sticker',
    sku: 'CI-STICKER-001',
    categoryId: 'cat-business-printing',
    categoryName: 'Business Printing',
    categorySlug: 'business-printing',
    description: 'High resolution die-cut custom stickers, product packaging labels, and waterproof vinyl stickers.',
    shortDescription: 'Custom die-cut vinyl stickers and labels.',
    price: 10.00,
    isFeatured: true,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
    ],
  },
  {
    id: 'prod-gift-001',
    name: 'Personalized Wooden Plaque',
    slug: 'personalized-gift',
    sku: 'CI-GIFT-001',
    categoryId: 'cat-personalized-gifts',
    categoryName: 'Personalized Gifts',
    categorySlug: 'personalized-gifts',
    description: 'Laser engraved or color printed personalized wooden plaque for birthdays, anniversaries, and awards.',
    shortDescription: 'Laser engraved personalized wooden plaque.',
    price: 1800.00,
    isFeatured: true,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
    ],
  },
  {
    id: 'prod-biz-001',
    name: 'Business Card Printing',
    slug: 'business-card-printing',
    sku: 'CI-BIZ-001',
    categoryId: 'cat-business-printing',
    categoryName: 'Business Printing',
    categorySlug: 'business-printing',
    description: 'Premium quality business cards on 350gsm art board with matte or velvet lamination.',
    shortDescription: 'Premium business card printing.',
    price: 5.00,
    isFeatured: true,
    isActive: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
    ],
  },
];
