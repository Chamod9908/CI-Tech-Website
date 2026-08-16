import { Role, OrderStatus, PaymentStatus, DeliveryMethod, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/db';

async function main() {
  console.log('Seeding started...');

  // Hashed Passwords
  const superAdminPassword = await bcrypt.hash('SuperAdmin#2026!', 10);
  const adminPassword = await bcrypt.hash('ColorLabAdmin#2026!', 10);
  const managerPassword = await bcrypt.hash('ColorLabManager#2026!', 10);
  const designerPassword = await bcrypt.hash('ColorLabDesigner#2026!', 10);
  const productionPassword = await bcrypt.hash('ColorLabProduction#2026!', 10);
  const customerPassword = await bcrypt.hash('ColorLabCustomer#2026!', 10);

  // 1. Users & Staff
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@colorlab.lk' },
    update: { passwordHash: superAdminPassword },
    create: {
      email: 'superadmin@colorlab.lk',
      name: 'Super Admin User',
      passwordHash: superAdminPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@colorlab.lk' },
    update: { passwordHash: adminPassword },
    create: {
      email: 'admin@colorlab.lk',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@colorlab.lk' },
    update: { passwordHash: managerPassword },
    create: {
      email: 'manager@colorlab.lk',
      name: 'Manager User',
      passwordHash: managerPassword,
      role: Role.MANAGER,
    },
  });

  const designer = await prisma.user.upsert({
    where: { email: 'designer@colorlab.lk' },
    update: { passwordHash: designerPassword },
    create: {
      email: 'designer@colorlab.lk',
      name: 'Designer User',
      passwordHash: designerPassword,
      role: Role.DESIGNER,
    },
  });

  const production = await prisma.user.upsert({
    where: { email: 'production@colorlab.lk' },
    update: { passwordHash: productionPassword },
    create: {
      email: 'production@colorlab.lk',
      name: 'Production Worker',
      passwordHash: productionPassword,
      role: Role.PRODUCTION_EMPLOYEE,
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@gmail.com' },
    update: { passwordHash: customerPassword },
    create: {
      email: 'customer@gmail.com',
      name: 'Ishan Customer',
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
    },
  });

  // Create Customer profile
  const customerProfile = await prisma.customer.upsert({
    where: { email: 'customer@gmail.com' },
    update: {},
    create: {
      userId: customerUser.id,
      email: 'customer@gmail.com',
      name: 'Ishan Customer',
      phone: '0771234567',
    },
  });

  // Create default customer address
  await prisma.address.create({
    data: {
      customerId: customerProfile.id,
      name: 'Home Address',
      line1: '123 Galle Road',
      line2: 'Colombo 03',
      city: 'Colombo',
      district: 'Colombo',
      postalCode: '00300',
      isDefault: true,
    },
  });

  console.log('Users and Customers seeded.');

  // 2. Delivery Zones
  const zones = [
    { name: 'Colombo', fee: 350.00, days: '1-2 Days' },
    { name: 'Gampaha', fee: 400.00, days: '2-3 Days' },
    { name: 'Kalutara', fee: 450.00, days: '2-3 Days' },
    { name: 'Kandy', fee: 500.00, days: '3-4 Days' },
    { name: 'Kurunegala', fee: 500.00, days: '3-4 Days' },
    { name: 'Galle', fee: 500.00, days: '3-4 Days' },
    { name: 'Matara', fee: 550.00, days: '3-4 Days' },
    { name: 'Other Districts', fee: 600.00, days: '4-5 Days' },
  ];

  for (const z of zones) {
    await prisma.deliveryZone.upsert({
      where: { name: z.name },
      update: { deliveryFee: z.fee, estimatedDays: z.days },
      create: { name: z.name, deliveryFee: z.fee, estimatedDays: z.days },
    });
  }
  console.log('Delivery Zones seeded.');

  // 3. Categories & Subcategories
  const categoriesData = [
    { name: 'Photo Printing', slug: 'photo-printing', description: 'Professional high-definition photo print lab services' },
    { name: 'Photo Print & Frame ( Complete)', slug: 'photo-print-and-frame-complete', description: 'Complete custom photo prints framed in glass, wood, black, white, box, and ply mount finishes' },
    { name: 'Photo Editing & Retouching', slug: 'photo-editing-and-retouching', description: 'Professional digital photo retouching, restoration, background removal, and colorization services' },
    { name: 'Photo Restoration', slug: 'photo-restoration', description: 'Professional restoration of old, damaged, faded, or low-quality photos with natural-looking results' },
    { name: 'Graphic Design', slug: 'graphic-design', description: 'Custom professional graphic design, logos, flyers, banners, social media posts, and branding materials' },
    { name: 'Photocopy & Printouts', slug: 'photocopy-and-printouts', description: 'Fast document photocopying, color/black & white printing in A4 and A3 sizes, single & double sided' },
    { name: 'Photo Frames', slug: 'photo-frames', description: 'Premium custom wooden, black, and white glass frames' },
    { name: 'Mug Printing', slug: 'mug-printing', description: 'Personalized designs printed on ceramic mugs' },
    { name: 'Personalized Gifts', slug: 'personalized-gifts', description: 'Custom printed shirts, keytags, crystals, and wood crafts' },
    { name: 'Business Printing', slug: 'business-printing', description: 'Business cards, stickers, labels, and promotional materials' },
    { name: 'Canvas & Collages', slug: 'canvas-and-collages', description: 'Large canvas prints and custom multi-photo layouts' },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const dbCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: { name: cat.name, slug: cat.slug, description: cat.description },
    });
    categoriesMap[cat.slug] = dbCat.id;
  }
  console.log('Categories seeded.');

  // 4. Products, Options, and Option Values
  // Custom Photo Frame
  const frameProd = await prisma.product.upsert({
    where: { slug: 'custom-photo-frame' },
    update: {},
    create: {
      name: 'Custom Photo Frame',
      slug: 'custom-photo-frame',
      sku: 'CI-FRAME-001',
      categoryId: categoriesMap['photo-frames'],
      description: 'Design and preview your custom wooden or synthetic photo frames. Includes premium glass options.',
      shortDescription: 'Custom frames available in multiple sizes and colors.',
      price: 1200.00,
      costPrice: 600.00,
      stock: 100,
      lowStockThreshold: 10,
      isFeatured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
        ],
      },
    },
  });

  // Add Frame Options
  const sizeOption = await prisma.productOption.create({
    data: {
      productId: frameProd.id,
      name: 'Size',
      values: {
        create: [
          { value: '4x6 inches', priceAdjustment: 0.00 },
          { value: '6x8 inches', priceAdjustment: 150.00 },
          { value: '8x12 inches', priceAdjustment: 350.00 },
          { value: '10x15 inches', priceAdjustment: 600.00 },
          { value: '12x18 inches', priceAdjustment: 900.00 },
        ],
      },
    },
  });

  const borderOption = await prisma.productOption.create({
    data: {
      productId: frameProd.id,
      name: 'Border Type',
      values: {
        create: [
          { value: 'Black Minimal', priceAdjustment: 0.00 },
          { value: 'White Minimal', priceAdjustment: 0.00 },
          { value: 'Teak Wood Finish', priceAdjustment: 200.00 },
          { value: 'Antique Gold', priceAdjustment: 300.00 },
        ],
      },
    },
  });

  const glassOption = await prisma.productOption.create({
    data: {
      productId: frameProd.id,
      name: 'Glass Protection',
      values: {
        create: [
          { value: 'Normal Clear Glass', priceAdjustment: 0.00 },
          { value: 'Matt / Anti-Glare Glass', priceAdjustment: 180.00 },
          { value: 'No Glass (Board Only)', priceAdjustment: -100.00 },
        ],
      },
    },
  });

  // Mug Printing Product
  const mugProd = await prisma.product.upsert({
    where: { slug: 'personalized-photo-mug' },
    update: {},
    create: {
      name: 'Personalized Photo Mug',
      slug: 'personalized-photo-mug',
      sku: 'CI-MUG-001',
      categoryId: categoriesMap['mug-printing'],
      description: 'Your favorite photos printed beautifully on high-quality ceramic mugs. Dishwasher and microwave safe.',
      shortDescription: 'High-quality personalized mugs for gifts.',
      price: 950.00,
      costPrice: 400.00,
      stock: 150,
      lowStockThreshold: 15,
      isFeatured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
        ],
      },
    },
  });

  await prisma.productOption.create({
    data: {
      productId: mugProd.id,
      name: 'Mug Variant',
      values: {
        create: [
          { value: 'Standard White Mug', priceAdjustment: 0.00 },
          { value: 'Color Changing Magic Mug', priceAdjustment: 300.00 },
          { value: 'Glitter Gold Mug', priceAdjustment: 200.00 },
          { value: 'Inner Color Mug (Red/Blue)', priceAdjustment: 100.00 },
        ],
      },
    },
  });

  // 4x6 Photo Printing Product
  const photo4x6 = await prisma.product.upsert({
    where: { slug: 'photo-print-4x6' },
    update: {},
    create: {
      name: 'Photo Print 4x6',
      slug: 'photo-print-4x6',
      sku: 'CI-PRINT-4X6',
      categoryId: categoriesMap['photo-printing'],
      description: 'Standard postcard size photo prints. High quality prints on glossy or matte professional photographic paper.',
      shortDescription: 'Standard 4x6 photo prints.',
      price: 50.00,
      costPrice: 20.00,
      stock: 10000,
      lowStockThreshold: 100,
      isFeatured: false,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
        ],
      },
    },
  });

  await prisma.productOption.create({
    data: {
      productId: photo4x6.id,
      name: 'Paper Finish',
      values: {
        create: [
          { value: 'Glossy Finish', priceAdjustment: 0.00 },
          { value: 'Matte Finish', priceAdjustment: 0.00 },
          { value: 'Satin Finish', priceAdjustment: 15.00 },
        ],
      },
    },
  });

  // 5x7 Photo Printing Product
  const photo5x7 = await prisma.product.upsert({
    where: { slug: 'photo-print-5x7' },
    update: {},
    create: {
      name: 'Photo Print 5x7',
      slug: 'photo-print-5x7',
      sku: 'CI-PRINT-5X7',
      categoryId: categoriesMap['photo-printing'],
      description: 'Classic 5x7 size photo prints. High quality prints on glossy or matte professional photographic paper.',
      shortDescription: 'Classic 5x7 photo prints.',
      price: 80.00,
      costPrice: 35.00,
      stock: 5000,
      lowStockThreshold: 50,
      isFeatured: false,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
        ],
      },
    },
  });

  // Seeding other required products
  const remainingProducts = [
    { name: 'Photo Collage Frame', slug: 'photo-collage', sku: 'CI-COLLAGE-001', cat: 'canvas-and-collages', price: 2500.00, cost: 1200.00 },
    { name: 'Laminated Photo Print', slug: 'laminated-photo', sku: 'CI-LAM-001', cat: 'photo-printing', price: 450.00, cost: 200.00 },
    { name: 'Custom Birthday Mug', slug: 'custom-birthday-mug', sku: 'CI-MUG-002', cat: 'mug-printing', price: 950.00, cost: 400.00 },
    { name: 'Personalized Wooden Plaque', slug: 'personalized-gift', sku: 'CI-GIFT-001', cat: 'personalized-gifts', price: 1800.00, cost: 800.00 },
    { name: 'Business Card Printing', slug: 'business-card-printing', sku: 'CI-BIZ-001', cat: 'business-printing', price: 5.00, cost: 2.00 },
    { name: 'Custom Stickers & Labels', slug: 'custom-sticker', sku: 'CI-STICKER-001', cat: 'business-printing', price: 10.00, cost: 4.00 },
    { name: 'Invitation Card Printing', slug: 'invitation-card', sku: 'CI-INV-001', cat: 'business-printing', price: 75.00, cost: 30.00 },
    { name: 'Wedding Photo Album', slug: 'photo-album', sku: 'CI-ALBUM-001', cat: 'photo-printing', price: 8500.00, cost: 4500.00 },
    { name: 'Premium Canvas Print', slug: 'canvas-print', sku: 'CI-CANVAS-001', cat: 'canvas-and-collages', price: 3800.00, cost: 1800.00 },
  ];

  for (const item of remainingProducts) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        price: item.price,
        costPrice: item.cost,
      },
      create: {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        categoryId: categoriesMap[item.cat],
        description: `Professional high-quality ${item.name} for personal or business needs. Customized to your specifications.`,
        shortDescription: `Custom ${item.name} made premium in Sri Lanka.`,
        price: item.price,
        costPrice: item.cost,
        stock: 200,
        lowStockThreshold: 15,
        isFeatured: true,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
          ],
        },
      },
    });
  }

  // Clean up old photo printing products to avoid SKU constraint conflicts
  const photoCatId = categoriesMap['photo-printing'];
  if (photoCatId) {
    await prisma.productOptionValue.deleteMany({
      where: { option: { product: { categoryId: photoCatId } } }
    });
    await prisma.productOption.deleteMany({
      where: { product: { categoryId: photoCatId } }
    });
    await prisma.productImage.deleteMany({
      where: { product: { categoryId: photoCatId } }
    });
    await prisma.cartItem.deleteMany({
      where: { product: { categoryId: photoCatId } }
    });
    await prisma.inventoryTransaction.deleteMany({
      where: { product: { categoryId: photoCatId } }
    });
    await prisma.product.deleteMany({
      where: { categoryId: photoCatId, orderItems: { none: {} } }
    });
  }

  // Dynamic Photo Print & Lamination Products with calculated Lamination Type options
  const photoPrintLaminationProducts = [
    {
      name: '4x4 Photo Print & Lamination',
      slug: '4x4-photo-print-lamination',
      sku: 'CI-PP-01',
      price: 40.00,
      costPrice: 15.00,
      description: '4x4 inch photo print produced on high-quality photo paper with sharp details and vibrant colors. Ideal for personal photographs, memories, ID/photo projects, gifts, albums, and creative printing needs.',
      shortDescription: 'High-quality 4x4 inch photo print with professional lamination options.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 20.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 25.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 25.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 30.00 },
      ],
    },
    {
      name: '4x6 Photo Print & Lamination',
      slug: '4x6-photo-print-lamination',
      sku: 'CI-PP-02',
      price: 50.00,
      costPrice: 20.00,
      description: 'Standard 4x6 inch (6x4) photo print produced on professional photographic paper. Choose your favorite lamination finish for vibrant colors and long-lasting protection.',
      shortDescription: 'Standard 4x6 photo print with custom lamination options.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 100.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 100.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 175.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 200.00 },
      ],
    },
    {
      name: '5x4 Photo Print & Lamination',
      slug: '5x4-photo-print-lamination',
      sku: 'CI-PP-03',
      price: 50.00,
      costPrice: 20.00,
      description: 'Compact 5x4 inch photo print on high-definition paper with durable, fade-resistant lamination choices.',
      shortDescription: 'Compact 5x4 photo print with custom lamination options.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 130.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 130.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 185.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 210.00 },
      ],
    },
    {
      name: '5x7 Photo Print & Lamination',
      slug: '5x7-photo-print-lamination',
      sku: 'CI-PP-04',
      price: 80.00,
      costPrice: 35.00,
      description: 'Classic 5x7 inch photo print with vivid colors and sharp details. Select your preferred lamination for moisture and scratch resistance.',
      shortDescription: 'Classic 5x7 photo print with custom lamination choices.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 170.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 170.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 320.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 350.00 },
      ],
    },
    {
      name: '6x8 Photo Print & Lamination',
      slug: '6x8-photo-print-lamination',
      sku: 'CI-PP-05',
      price: 100.00,
      costPrice: 45.00,
      description: 'Medium format 6x8 photo print produced on lab-grade photo paper with optional hot, cold, silver, or crystal glass-look laminations.',
      shortDescription: 'Medium 6x8 photo print with custom lamination.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 100.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 300.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 325.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 360.00 },
      ],
    },
    {
      name: '8x10 Photo Print & Lamination',
      slug: '8x10-photo-print-lamination',
      sku: 'CI-PP-06',
      price: 150.00,
      costPrice: 70.00,
      description: 'Popular portrait size 8x10 photo print. Add premium lamination for enhanced shine, matt protection, or glass-like crystal gloss.',
      shortDescription: 'Portrait size 8x10 photo print with lamination options.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 150.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 400.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 430.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 480.00 },
      ],
    },
    {
      name: '8x12 Photo Print & Lamination',
      slug: '8x12-photo-print-lamination',
      sku: 'CI-PP-07',
      price: 200.00,
      costPrice: 90.00,
      description: 'Full 8x12 photo print size. Perfect for framing or album preservation with custom hot, cold matt, silver shine, or crystal glass-look finishes.',
      shortDescription: 'Full 8x12 photo print with lamination options.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 200.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 400.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 430.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 480.00 },
      ],
    },
    {
      name: '10x12 Photo Print & Lamination',
      slug: '10x12-photo-print-lamination',
      sku: 'CI-PP-08',
      price: 250.00,
      costPrice: 110.00,
      description: 'Large 10x12 inch photo print. Ideal for family portraits, studio photography, and wedding prints with custom lamination protection.',
      shortDescription: '10x12 photo print with custom lamination options.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 200.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 500.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 530.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 580.00 },
      ],
    },
    {
      name: '10x15 Photo Print & Lamination',
      slug: '10x15-photo-print-lamination',
      sku: 'CI-PP-09',
      price: 280.00,
      costPrice: 130.00,
      description: 'Extended 10x15 inch photo print with rich color output and durable lamination options.',
      shortDescription: '10x15 photo print with lamination options.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 210.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 520.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 550.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 600.00 },
      ],
    },
    {
      name: '12x15 Photo Print & Lamination',
      slug: '12x15-photo-print-lamination',
      sku: 'CI-PP-10',
      price: 350.00,
      costPrice: 160.00,
      description: 'Pro studio size 12x15 photo print with optional hot, cold matt, silver shine, or crystal glass-look laminations.',
      shortDescription: '12x15 photo print with custom lamination choices.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 230.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 640.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 670.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 720.00 },
      ],
    },
    {
      name: '12x18 Photo Print & Lamination',
      slug: '12x18-photo-print-lamination',
      sku: 'CI-PP-11',
      price: 400.00,
      costPrice: 180.00,
      description: 'Large format 12x18 photo print size. Lab-quality printing with durable protective lamination choices.',
      shortDescription: 'Large 12x18 photo print with lamination options.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 300.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 750.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 780.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 850.00 },
      ],
    },
    {
      name: '16x24 Photo Print & Lamination',
      slug: '16x24-photo-print-lamination',
      sku: 'CI-PP-12',
      price: 1200.00,
      costPrice: 500.00,
      description: 'Jumbo 16x24 photo print with high-definition details and custom lamination finishes.',
      shortDescription: '16x24 jumbo photo print with lamination options.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 800.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 1750.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 1780.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 1900.00 },
      ],
    },
    {
      name: '20x30 Photo Print & Lamination',
      slug: '20x30-photo-print-lamination',
      sku: 'CI-PP-13',
      price: 1800.00,
      costPrice: 800.00,
      description: 'Extra large 20x30 photo poster print. Select hot, cold matt, silver shine, or crystal glass-look laminations.',
      shortDescription: '20x30 poster photo print with lamination options.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 1200.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 2000.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 3600.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 3800.00 },
      ],
    },
    {
      name: '24x36 Photo Print & Lamination',
      slug: '24x36-photo-print-lamination',
      sku: 'CI-PP-14',
      price: 2500.00,
      costPrice: 1000.00,
      description: 'Grand format 24x36 photo print. Maximum clarity and durability with custom protective lamination.',
      shortDescription: 'Grand 24x36 photo print with lamination options.',
      laminations: [
        { value: 'None (No Lamination)', priceAdjustment: 0.00 },
        { value: 'Hot Lamination', priceAdjustment: 1500.00 },
        { value: 'Cold Lamination (Matt)', priceAdjustment: 2750.00 },
        { value: 'Silver Lamination (Shine)', priceAdjustment: 4000.00 },
        { value: 'Glass-Look Lamination (Crystal)', priceAdjustment: 4200.00 },
      ],
    },
  ];

  for (const item of photoPrintLaminationProducts) {
    const prod = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        price: item.price,
        costPrice: item.costPrice,
        sku: item.sku,
        description: item.description,
        shortDescription: item.shortDescription,
      },
      create: {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        categoryId: categoriesMap['photo-printing'],
        description: item.description,
        shortDescription: item.shortDescription,
        price: item.price,
        costPrice: item.costPrice,
        stock: 1000,
        lowStockThreshold: 20,
        isFeatured: true,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
          ],
        },
      },
    });

    // Delete existing Lamination Type option to recreate cleanly
    await prisma.productOption.deleteMany({
      where: { productId: prod.id, name: 'LAMINATION TYPE' },
    });

    // Create Lamination Type option with values and price adjustments
    await prisma.productOption.create({
      data: {
        productId: prod.id,
        name: 'LAMINATION TYPE',
        isRequired: true,
        values: {
          create: item.laminations.map((lam) => ({
            value: lam.value,
            priceAdjustment: lam.priceAdjustment,
          })),
        },
      },
    });
  }

  // Clean up old photo frame products to prevent SKU conflicts
  const frameCatId = categoriesMap['photo-print-and-frame-complete'];
  if (frameCatId) {
    await prisma.productOptionValue.deleteMany({
      where: { option: { product: { categoryId: frameCatId } } }
    });
    await prisma.productOption.deleteMany({
      where: { product: { categoryId: frameCatId } }
    });
    await prisma.productImage.deleteMany({
      where: { product: { categoryId: frameCatId } }
    });
    await prisma.cartItem.deleteMany({
      where: { product: { categoryId: frameCatId } }
    });
    await prisma.inventoryTransaction.deleteMany({
      where: { product: { categoryId: frameCatId } }
    });
    await prisma.product.deleteMany({
      where: { categoryId: frameCatId, orderItems: { none: {} } }
    });
  }

  // Complete Photo Print & Frame Products with calculated Glass vs Ply Mount options
  const unifiedFrameProducts = [
    {
      name: '4x4 Photo Print & Frame (Complete)',
      slug: '4x4-photo-print-and-frame-complete',
      sku: 'CI-PF-4X4',
      price: 500.00,
      costPrice: 350.00,
      description: 'Complete 4x4 inch photo print and frame. Select your preferred frame finish (Ply Mount, Black Glass, or Wood Glass) and lamination type.',
      frameTypes: [
        { value: 'Ply Mount Frame', priceAdjustment: 0.00 },
        { value: 'Black Glass Frame', priceAdjustment: 0.00 },
        { value: 'Wood Glass Frame', priceAdjustment: 0.00 },
      ],
    },
    {
      name: '4x6 Photo Print & Frame (Complete)',
      slug: '4x6-photo-print-and-frame-complete',
      sku: 'CI-PF-4X6',
      price: 600.00,
      costPrice: 200.00,
      description: 'Standard 4x6 inch (6x4) complete photo print and frame. Choose Ply Mount or Glass Frame (Black, White, Wood) with free lamination choices.',
      frameTypes: [
        { value: 'Ply Mount Frame', priceAdjustment: 0.00 },
        { value: 'Black Glass Frame', priceAdjustment: 0.00 },
        { value: 'White Glass Frame', priceAdjustment: 50.00 },
        { value: 'Wood Glass Frame', priceAdjustment: 50.00 },
      ],
    },
    {
      name: '6x8 Photo Print & Frame (Complete)',
      slug: '6x8-photo-print-and-frame-complete',
      sku: 'CI-PF-6X8',
      price: 900.00,
      costPrice: 380.00,
      description: 'Medium 6x8 inch complete photo print and frame. Select Ply Mount or Glass Frame styles with custom lamination finishes.',
      frameTypes: [
        { value: 'Ply Mount Frame', priceAdjustment: 0.00 },
        { value: 'Black Glass Frame', priceAdjustment: 0.00 },
        { value: 'White Glass Frame', priceAdjustment: 0.00 },
        { value: 'Wood Glass Frame', priceAdjustment: 50.00 },
        { value: 'Premium Box Glass Frame', priceAdjustment: 300.00 },
      ],
    },
    {
      name: '8x12 Photo Print & Frame (Complete)',
      slug: '8x12-photo-print-and-frame-complete',
      sku: 'CI-PF-8X12',
      price: 1700.00,
      costPrice: 700.00,
      description: 'Full 8x12 inch complete photo print and frame. Choose Ply Mount or Glass Frame finishes with free lamination choices.',
      frameTypes: [
        { value: 'Ply Mount Frame', priceAdjustment: 0.00 },
        { value: 'Black Glass Frame', priceAdjustment: 100.00 },
        { value: 'White Glass Frame', priceAdjustment: 100.00 },
        { value: 'Teak Wood Glass Frame', priceAdjustment: 100.00 },
        { value: 'Premium Box Glass Frame', priceAdjustment: 550.00 },
      ],
    },
    {
      name: '10x12 Photo Print & Frame (Complete)',
      slug: '10x12-photo-print-and-frame-complete',
      sku: 'CI-PF-10X12',
      price: 2300.00,
      costPrice: 600.00,
      description: '10x12 inch complete photo print and frame. Select Ply Mount or Black Glass Frame with free lamination choices.',
      frameTypes: [
        { value: 'Ply Mount Frame', priceAdjustment: 0.00 },
        { value: 'Black Glass Frame', priceAdjustment: 100.00 },
      ],
    },
    {
      name: '10x15 Photo Print & Frame (Complete)',
      slug: '10x15-photo-print-and-frame-complete',
      sku: 'CI-PF-10X15',
      price: 2700.00,
      costPrice: 950.00,
      description: '10x15 inch complete photo print and frame. Select Ply Mount or Glass Frame (Black or Wood) with custom lamination finishes.',
      frameTypes: [
        { value: 'Ply Mount Frame', priceAdjustment: 0.00 },
        { value: 'Black Glass Frame', priceAdjustment: 100.00 },
        { value: 'Teak Wood Glass Frame', priceAdjustment: 100.00 },
      ],
    },
    {
      name: '12x15 Photo Print & Frame (Complete)',
      slug: '12x15-photo-print-and-frame-complete',
      sku: 'CI-PF-12X15',
      price: 3000.00,
      costPrice: 1000.00,
      description: 'Pro studio 12x15 inch complete photo print and frame. Select Ply Mount or Glass Frame (Black or Wood) with free lamination choices.',
      frameTypes: [
        { value: 'Ply Mount Frame', priceAdjustment: 0.00 },
        { value: 'Black Glass Frame', priceAdjustment: 200.00 },
        { value: 'Teak Wood Glass Frame', priceAdjustment: 250.00 },
      ],
    },
    {
      name: '12x18 Photo Print & Frame (Complete)',
      slug: '12x18-photo-print-and-frame-complete',
      sku: 'CI-PF-12X18',
      price: 3300.00,
      costPrice: 1500.00,
      description: 'Large 12x18 inch complete photo print and frame. Select Ply Mount or Glass Frame (Black, White, Wood, Brown) with custom lamination finishes.',
      frameTypes: [
        { value: 'Ply Mount Frame', priceAdjustment: 0.00 },
        { value: 'Black Glass Frame', priceAdjustment: 200.00 },
        { value: 'White Glass Frame', priceAdjustment: 200.00 },
        { value: 'Teak Wood Glass Frame', priceAdjustment: 200.00 },
        { value: 'Brown Glass Frame', priceAdjustment: 200.00 },
      ],
    },
    {
      name: '16x24 Photo Print & Frame (Complete)',
      slug: '16x24-photo-print-and-frame-complete',
      sku: 'CI-PF-16X24',
      price: 4800.00,
      costPrice: 1200.00,
      description: 'Jumbo 16x24 inch complete photo print and frame. Choose Ply Mount or Black Normal Glass Frame with free lamination finishes.',
      frameTypes: [
        { value: 'Ply Mount Frame', priceAdjustment: 0.00 },
        { value: 'Black Normal Glass Frame', priceAdjustment: 400.00 },
      ],
    },
    {
      name: '20x30 Photo Print & Frame (Complete)',
      slug: '20x30-photo-print-and-frame-complete',
      sku: 'CI-PF-20X30',
      price: 8500.00,
      costPrice: 3000.00,
      description: 'Extra large 20x30 inch poster photo print and frame. Select Ply Mount or Black Design Glass Frame.',
      frameTypes: [
        { value: 'Ply Mount Frame', priceAdjustment: 0.00 },
        { value: 'Black Design Glass Frame', priceAdjustment: 1700.00 },
      ],
    },
    {
      name: '24x36 Photo Print & Frame (Complete)',
      slug: '24x36-photo-print-and-frame-complete',
      sku: 'CI-PF-24X36',
      price: 11500.00,
      costPrice: 4000.00,
      description: 'Grand 24x36 inch complete photo print and frame. Select Ply Mount or Black Design Glass Frame with free lamination choices.',
      frameTypes: [
        { value: 'Ply Mount Frame', priceAdjustment: 0.00 },
        { value: 'Black Design Glass Frame', priceAdjustment: 2350.00 },
      ],
    },
  ];

  for (const item of unifiedFrameProducts) {
    const prod = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        price: item.price,
        costPrice: item.costPrice,
        sku: item.sku,
        description: item.description,
        categoryId: categoriesMap['photo-print-and-frame-complete'],
      },
      create: {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        categoryId: categoriesMap['photo-print-and-frame-complete'],
        description: item.description,
        shortDescription: `Complete framed print (${item.sku}).`,
        price: item.price,
        costPrice: item.costPrice,
        stock: 500,
        lowStockThreshold: 15,
        isFeatured: true,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
          ],
        },
      },
    });

    // Delete existing options to recreate cleanly
    await prisma.productOption.deleteMany({
      where: { productId: prod.id },
    });

    // Option 1: FRAME & MOUNT TYPE
    await prisma.productOption.create({
      data: {
        productId: prod.id,
        name: 'FRAME / MOUNT TYPE',
        isRequired: true,
        values: {
          create: item.frameTypes.map((ft) => ({
            value: ft.value,
            priceAdjustment: ft.priceAdjustment,
          })),
        },
      },
    });

    // Option 2: LAMINATION FINISH (No extra charge for laminations)
    await prisma.productOption.create({
      data: {
        productId: prod.id,
        name: 'LAMINATION FINISH',
        isRequired: true,
        values: {
          create: [
            { value: 'Matt Finish', priceAdjustment: 0.00 },
            { value: 'Shine Finish', priceAdjustment: 0.00 },
            { value: 'Glass-Look (Crystal)', priceAdjustment: 0.00 },
          ],
        },
      },
    });
  }

  // 19 Photo Editing & Retouching Services
  const photoEditingServices = [
    {
      name: 'Basic Photo Editing',
      slug: 'basic-photo-editing',
      sku: 'CI-ED-01',
      price: 200.00,
      costPrice: 50.00,
      description: 'Standard image enhancement including brightness, contrast adjustment, cropping, and light retouching.',
    },
    {
      name: 'Photo Retouching',
      slug: 'photo-retouching',
      sku: 'CI-ED-02',
      price: 300.00,
      costPrice: 75.00,
      description: 'General photo retouching for portrait and casual photos with color balance and tone cleanup.',
    },
    {
      name: 'Professional Portrait Retouching',
      slug: 'professional-portrait-retouching',
      sku: 'CI-ED-03',
      price: 500.00,
      costPrice: 100.00,
      description: 'High-end studio portrait retouching including skin smoothing, eye sharpening, and stray hair removal.',
    },
    {
      name: 'Skin & Face Retouching',
      slug: 'skin-and-face-retouching',
      sku: 'CI-ED-04',
      price: 300.00,
      costPrice: 75.00,
      description: 'Focused facial retouching, blemish removal, skin softening, and subtle tone enhancement.',
    },
    {
      name: 'Background Removal',
      slug: 'background-removal',
      sku: 'CI-ED-05',
      price: 250.00,
      costPrice: 50.00,
      description: 'Clean cut-out background removal for product photos, portraits, or ID pictures transparent PNG.',
    },
    {
      name: 'Background Replacement',
      slug: 'background-replacement',
      sku: 'CI-ED-06',
      price: 500.00,
      costPrice: 100.00,
      description: 'Replace original background with studio backdrop, solid color, landscape, or custom scenery.',
    },
    {
      name: 'Object / Person Removal',
      slug: 'object-person-removal',
      sku: 'CI-ED-07',
      price: 500.00,
      costPrice: 100.00,
      description: 'Seamlessly remove unwanted objects, photobombers, text, or clutter from your photos.',
    },
    {
      name: 'Photo Enhancement',
      slug: 'photo-enhancement',
      sku: 'CI-ED-08',
      price: 300.00,
      costPrice: 75.00,
      description: 'Overall digital photo enhancement for improved clarity, lighting, saturation, and detail sharpness.',
    },
    {
      name: 'Photo Upscaling / HD Enhancement',
      slug: 'photo-upscaling-hd-enhancement',
      sku: 'CI-ED-09',
      price: 500.00,
      costPrice: 100.00,
      description: 'AI-assisted super resolution upscaling to convert low-res photos into crisp high-definition print quality.',
    },
    {
      name: 'Old Photo Restoration',
      slug: 'old-photo-restoration',
      sku: 'CI-ED-10',
      price: 750.00,
      costPrice: 150.00,
      description: 'Restore faded, aged, torn, or damaged historical photographs back to life.',
    },
    {
      name: 'Old Photo Restoration + Colorization',
      slug: 'old-photo-restoration-colorization',
      sku: 'CI-ED-11',
      price: 1200.00,
      costPrice: 250.00,
      description: 'Complete vintage photo restoration combined with natural full-color colorization.',
    },
    {
      name: 'Black & White Photo Colorization',
      slug: 'black-and-white-photo-colorization',
      sku: 'CI-ED-12',
      price: 750.00,
      costPrice: 150.00,
      description: 'Transform monochrome black and white photos into realistic vibrant color images.',
    },
    {
      name: 'Photo Damage / Scratch Repair',
      slug: 'photo-damage-scratch-repair',
      sku: 'CI-ED-13',
      price: 750.00,
      costPrice: 150.00,
      description: 'Repair scratches, cracks, water stains, creases, and physical damage on printed photographs.',
    },
    {
      name: 'Professional Color Correction',
      slug: 'professional-color-correction',
      sku: 'CI-ED-14',
      price: 300.00,
      costPrice: 75.00,
      description: 'Expert color grading and color cast correction for wedding, event, and portrait photography.',
    },
    {
      name: 'Photo Cropping & Resizing',
      slug: 'photo-cropping-and-resizing',
      sku: 'CI-ED-15',
      price: 150.00,
      costPrice: 30.00,
      description: 'Precision cropping, dimension adjustment, aspect ratio framing, and resolution optimization.',
    },
    {
      name: 'Passport / ID Photo Editing',
      slug: 'passport-id-photo-editing',
      sku: 'CI-ED-16',
      price: 200.00,
      costPrice: 50.00,
      description: 'Format photos for official passport, visa, driving license, and ID card standards (coat suit addition optional).',
    },
    {
      name: 'Wedding Photo Retouching',
      slug: 'wedding-photo-retouching',
      sku: 'CI-ED-17',
      price: 750.00,
      costPrice: 150.00,
      description: 'Romantic bridal and groom portrait retouching, dress detail cleanup, atmosphere color grading.',
    },
    {
      name: 'Photo Manipulation / Creative Editing',
      slug: 'photo-manipulation-creative-editing',
      sku: 'CI-ED-18',
      price: 1000.00,
      costPrice: 200.00,
      description: 'Creative photo compositing, head swaps, digital fantasy artwork, and custom surreal editing.',
    },
    {
      name: 'Complete Photo Restoration',
      slug: 'complete-photo-restoration',
      sku: 'CI-ED-19',
      price: 1500.00,
      costPrice: 300.00,
      description: 'Full comprehensive restoration package for severely damaged, missing piece, or severely degraded photos.',
    },
  ];

  for (const service of photoEditingServices) {
    await prisma.product.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        price: service.price,
        costPrice: service.costPrice,
        sku: service.sku,
        description: service.description,
        categoryId: categoriesMap['photo-editing-and-retouching'],
      },
      create: {
        name: service.name,
        slug: service.slug,
        sku: service.sku,
        categoryId: categoriesMap['photo-editing-and-retouching'],
        description: service.description,
        shortDescription: service.description,
        price: service.price,
        costPrice: service.costPrice,
        stock: 9999,
        lowStockThreshold: 10,
        isFeatured: true,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
          ],
        },
      },
    });
  }

  // Unified Configurator Product: Photo Editing & Retouching Services
  const mainEditingProd = await prisma.product.upsert({
    where: { slug: 'photo-editing-and-retouching-services' },
    update: {
      name: 'Photo Editing & Retouching Services',
      price: 200.00,
      costPrice: 50.00,
      sku: 'CI-ED-MAIN',
      description: 'Professional photo editing, retouching, restoration, background removal, and colorization services. Upload your photo and select your required service.',
      categoryId: categoriesMap['photo-editing-and-retouching'],
    },
    create: {
      name: 'Photo Editing & Retouching Services',
      slug: 'photo-editing-and-retouching-services',
      sku: 'CI-ED-MAIN',
      categoryId: categoriesMap['photo-editing-and-retouching'],
      description: 'Professional photo editing, retouching, restoration, background removal, and colorization services. Upload your photo and select your required service.',
      shortDescription: 'Upload your photo and select from 19 professional editing & retouching services.',
      price: 200.00,
      costPrice: 50.00,
      stock: 9999,
      lowStockThreshold: 10,
      isFeatured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
        ],
      },
    },
  });

  await prisma.productOption.deleteMany({
    where: { productId: mainEditingProd.id },
  });

  await prisma.productOption.create({
    data: {
      productId: mainEditingProd.id,
      name: 'SERVICE TYPE',
      isRequired: true,
      values: {
        create: [
          { value: 'Photo Cropping & Resizing', priceAdjustment: -50.00 },
          { value: 'Basic Photo Editing', priceAdjustment: 0.00 },
          { value: 'Passport / ID Photo Editing', priceAdjustment: 0.00 },
          { value: 'Background Removal', priceAdjustment: 50.00 },
          { value: 'Photo Retouching', priceAdjustment: 100.00 },
          { value: 'Skin & Face Retouching', priceAdjustment: 100.00 },
          { value: 'Photo Enhancement', priceAdjustment: 100.00 },
          { value: 'Professional Color Correction', priceAdjustment: 100.00 },
          { value: 'Professional Portrait Retouching', priceAdjustment: 300.00 },
          { value: 'Background Replacement', priceAdjustment: 300.00 },
          { value: 'Object / Person Removal', priceAdjustment: 300.00 },
          { value: 'Photo Upscaling / HD Enhancement', priceAdjustment: 300.00 },
          { value: 'Old Photo Restoration', priceAdjustment: 550.00 },
          { value: 'Black & White Photo Colorization', priceAdjustment: 550.00 },
          { value: 'Photo Damage / Scratch Repair', priceAdjustment: 550.00 },
          { value: 'Wedding Photo Retouching', priceAdjustment: 550.00 },
          { value: 'Photo Manipulation / Creative Editing', priceAdjustment: 800.00 },
          { value: 'Old Photo Restoration + Colorization', priceAdjustment: 1000.00 },
          { value: 'Complete Photo Restoration', priceAdjustment: 1300.00 },
        ],
      },
    },
  });

  // Clean up extra individual restoration products so only the main Photo Restoration product exists in this category
  const restCatId = categoriesMap['photo-restoration'];
  if (restCatId) {
    await prisma.productOptionValue.deleteMany({
      where: { option: { product: { categoryId: restCatId, slug: { not: 'photo-restoration' } } } }
    });
    await prisma.productOption.deleteMany({
      where: { product: { categoryId: restCatId, slug: { not: 'photo-restoration' } } }
    });
    await prisma.productImage.deleteMany({
      where: { product: { categoryId: restCatId, slug: { not: 'photo-restoration' } } }
    });
    await prisma.cartItem.deleteMany({
      where: { product: { categoryId: restCatId, slug: { not: 'photo-restoration' } } }
    });
    await prisma.inventoryTransaction.deleteMany({
      where: { product: { categoryId: restCatId, slug: { not: 'photo-restoration' } } }
    });
    await prisma.product.deleteMany({
      where: { categoryId: restCatId, slug: { not: 'photo-restoration' }, orderItems: { none: {} } }
    });
  }

  // Main Configurator Product: Photo Restoration
  const mainRestorationProd = await prisma.product.upsert({
    where: { slug: 'photo-restoration' },
    update: {
      name: 'Photo Restoration',
      price: 500.00,
      costPrice: 100.00,
      sku: 'CI-REST-MAIN',
      description: 'Bring your precious memories back to life with our Photo Restoration Service. We carefully restore old, faded, scratched, torn, or damaged photographs by repairing imperfections, improving clarity, enhancing colors, and restoring missing details while preserving the original appearance and natural look of the photo. Ideal for family memories, vintage photographs, wedding photos, and treasured keepsakes.',
      shortDescription: 'Professional restoration of old, damaged, faded, or low-quality photos with natural-looking results.',
      categoryId: categoriesMap['photo-restoration'],
    },
    create: {
      name: 'Photo Restoration',
      slug: 'photo-restoration',
      sku: 'CI-REST-MAIN',
      categoryId: categoriesMap['photo-restoration'],
      description: 'Bring your precious memories back to life with our Photo Restoration Service. We carefully restore old, faded, scratched, torn, or damaged photographs by repairing imperfections, improving clarity, enhancing colors, and restoring missing details while preserving the original appearance and natural look of the photo. Ideal for family memories, vintage photographs, wedding photos, and treasured keepsakes.',
      shortDescription: 'Professional restoration of old, damaged, faded, or low-quality photos with natural-looking results.',
      price: 500.00,
      costPrice: 100.00,
      stock: 9999,
      lowStockThreshold: 10,
      isFeatured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
        ],
      },
    },
  });

  await prisma.productOption.deleteMany({
    where: { productId: mainRestorationProd.id },
  });

  await prisma.productOption.create({
    data: {
      productId: mainRestorationProd.id,
      name: 'RESTORATION TYPE',
      isRequired: true,
      values: {
        create: [
          { value: 'Basic Photo Restoration', priceAdjustment: 0.00 },
          { value: 'Scratch & Dust Removal', priceAdjustment: 0.00 },
          { value: 'Black & White Photo Enhancement', priceAdjustment: 0.00 },
          { value: 'Old Photo Repair', priceAdjustment: 250.00 },
          { value: 'Faded Photo Restoration', priceAdjustment: 250.00 },
          { value: 'Torn / Damaged Photo Repair', priceAdjustment: 500.00 },
          { value: 'Old Photo Colorization', priceAdjustment: 500.00 },
          { value: 'Face & Detail Restoration', priceAdjustment: 500.00 },
          { value: 'Photo Restoration + Colorization', priceAdjustment: 1000.00 },
          { value: 'Advanced Photo Restoration', priceAdjustment: 1500.00 },
          { value: 'Complete Photo Restoration', priceAdjustment: 2000.00 },
        ],
      },
    },
  });

  // 21 Graphic Design Services & Configurator
  const graphicDesignServices = [
    {
      name: 'Simple Graphic Design',
      slug: 'simple-graphic-design',
      sku: 'CI-GD-01',
      price: 500.00,
      costPrice: 100.00,
      description: 'Quick graphic layout design for simple text, graphics, or layout adjustments.',
    },
    {
      name: 'Social Media Post Design',
      slug: 'social-media-post-design',
      sku: 'CI-GD-02',
      price: 750.00,
      costPrice: 150.00,
      description: 'Custom social media graphic posts designed for Facebook, Instagram, Twitter, or LinkedIn.',
    },
    {
      name: 'Facebook / Instagram Post',
      slug: 'facebook-instagram-post-design',
      sku: 'CI-GD-03',
      price: 750.00,
      costPrice: 150.00,
      description: 'Eye-catching promotional, offer, or event post graphics tailored for Facebook & Instagram feeds/stories.',
    },
    {
      name: 'Flyer Design',
      slug: 'flyer-design',
      sku: 'CI-GD-04',
      price: 1000.00,
      costPrice: 200.00,
      description: 'Single-sided or double-sided business flyer & leaflet design for promotions, marketing, and events.',
    },
    {
      name: 'Poster Design',
      slug: 'poster-design',
      sku: 'CI-GD-05',
      price: 1000.00,
      costPrice: 200.00,
      description: 'High-impact poster artwork design suitable for indoor or outdoor display.',
    },
    {
      name: 'Business Card Design',
      slug: 'business-card-design',
      sku: 'CI-GD-06',
      price: 750.00,
      costPrice: 150.00,
      description: 'Professional corporate or creative visiting card design with front & back layouts.',
    },
    {
      name: 'Brochure Design',
      slug: 'brochure-design',
      sku: 'CI-GD-07',
      price: 1500.00,
      costPrice: 300.00,
      description: 'Multi-page or bi-fold / tri-fold corporate company profile & product brochure design.',
    },
    {
      name: 'Invitation Card Design',
      slug: 'invitation-card-design',
      sku: 'CI-GD-08',
      price: 1000.00,
      costPrice: 200.00,
      description: 'Custom event invitation card design for parties, functions, or ceremony events.',
    },
    {
      name: 'Wedding Invitation Design',
      slug: 'wedding-invitation-design',
      sku: 'CI-GD-09',
      price: 1500.00,
      costPrice: 300.00,
      description: 'Elegant bespoke wedding card invitation design including RSVP & thank you card layouts.',
    },
    {
      name: 'Birthday Invitation Design',
      slug: 'birthday-invitation-design',
      sku: 'CI-GD-10',
      price: 1000.00,
      costPrice: 200.00,
      description: 'Fun & vibrant birthday party invitation design tailored to any theme or age.',
    },
    {
      name: 'Banner Design',
      slug: 'banner-design',
      sku: 'CI-GD-11',
      price: 1500.00,
      costPrice: 300.00,
      description: 'Large format flex/vinyl banner graphic design for storefronts, hoarding, or events.',
    },
    {
      name: 'Roll-up Banner Design',
      slug: 'rollup-banner-design',
      sku: 'CI-GD-12',
      price: 1500.00,
      costPrice: 300.00,
      description: 'Professional standee / roll-up pull-up banner design for exhibition booths & trade shows.',
    },
    {
      name: 'Logo Design',
      slug: 'logo-design',
      sku: 'CI-GD-13',
      price: 2500.00,
      costPrice: 500.00,
      description: 'Custom brand logo design including vector master files, color variations, and typography guidance.',
    },
    {
      name: 'Letterhead Design',
      slug: 'letterhead-design',
      sku: 'CI-GD-14',
      price: 750.00,
      costPrice: 150.00,
      description: 'Official corporate letterhead stationery design formatted for print and digital PDF use.',
    },
    {
      name: 'Certificate Design',
      slug: 'certificate-design',
      sku: 'CI-GD-15',
      price: 750.00,
      costPrice: 150.00,
      description: 'Formal appreciation, achievement, or completion award certificate design.',
    },
    {
      name: 'Menu Design',
      slug: 'menu-design',
      sku: 'CI-GD-16',
      price: 1000.00,
      costPrice: 200.00,
      description: 'Appetizing restaurant, cafe, or hotel food & beverage menu card design.',
    },
    {
      name: 'Product Label Design',
      slug: 'product-label-design',
      sku: 'CI-GD-17',
      price: 1500.00,
      costPrice: 300.00,
      description: 'Custom sticker, bottle, or jar product label design with print-ready die lines.',
    },
    {
      name: 'Packaging Design',
      slug: 'packaging-design',
      sku: 'CI-GD-18',
      price: 2500.00,
      costPrice: 500.00,
      description: 'Commercial product box, pouch, or carton packaging design with full print dylines.',
    },
    {
      name: 'Advertisement Design',
      slug: 'advertisement-design',
      sku: 'CI-GD-19',
      price: 1000.00,
      costPrice: 200.00,
      description: 'Promotional ad design for newspaper, magazine, digital web banner, or billboard.',
    },
    {
      name: 'Photo Collage Design',
      slug: 'photo-collage-design',
      sku: 'CI-GD-20',
      price: 750.00,
      costPrice: 150.00,
      description: 'Artistic multi-photo collage layout design for wall frames, albums, or canvas prints.',
    },
    {
      name: 'Album Page Design',
      slug: 'album-page-design',
      sku: 'CI-GD-21',
      price: 500.00,
      costPrice: 100.00,
      description: 'Custom photo storybook or wedding photobook page spread design.',
    },
  ];

  for (const service of graphicDesignServices) {
    await prisma.product.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        price: service.price,
        costPrice: service.costPrice,
        sku: service.sku,
        description: service.description,
        categoryId: categoriesMap['graphic-design'],
      },
      create: {
        name: service.name,
        slug: service.slug,
        sku: service.sku,
        categoryId: categoriesMap['graphic-design'],
        description: service.description,
        shortDescription: service.description,
        price: service.price,
        costPrice: service.costPrice,
        stock: 9999,
        lowStockThreshold: 10,
        isFeatured: true,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
          ],
        },
      },
    });
  }

  // Main Configurator Product: Graphic Design Services
  const mainDesignProd = await prisma.product.upsert({
    where: { slug: 'graphic-design-services' },
    update: {
      name: 'Graphic Design Services',
      price: 500.00,
      costPrice: 100.00,
      sku: 'CI-GD-MAIN',
      description: 'Professional creative graphic design services for logos, flyers, social media posts, banners, invitations, menus, and corporate branding.',
      shortDescription: 'Custom graphic design, branding, and artwork services for print & digital media.',
      categoryId: categoriesMap['graphic-design'],
    },
    create: {
      name: 'Graphic Design Services',
      slug: 'graphic-design-services',
      sku: 'CI-GD-MAIN',
      categoryId: categoriesMap['graphic-design'],
      description: 'Professional creative graphic design services for logos, flyers, social media posts, banners, invitations, menus, and corporate branding.',
      shortDescription: 'Custom graphic design, branding, and artwork services for print & digital media.',
      price: 500.00,
      costPrice: 100.00,
      stock: 9999,
      lowStockThreshold: 10,
      isFeatured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
        ],
      },
    },
  });

  await prisma.productOption.deleteMany({
    where: { productId: mainDesignProd.id },
  });

  await prisma.productOption.create({
    data: {
      productId: mainDesignProd.id,
      name: 'DESIGN SERVICE TYPE',
      isRequired: true,
      values: {
        create: [
          { value: 'Simple Graphic Design', priceAdjustment: 0.00 },
          { value: 'Album Page Design', priceAdjustment: 0.00 },
          { value: 'Social Media Post Design', priceAdjustment: 250.00 },
          { value: 'Facebook / Instagram Post', priceAdjustment: 250.00 },
          { value: 'Business Card Design', priceAdjustment: 250.00 },
          { value: 'Letterhead Design', priceAdjustment: 250.00 },
          { value: 'Certificate Design', priceAdjustment: 250.00 },
          { value: 'Photo Collage Design', priceAdjustment: 250.00 },
          { value: 'Flyer Design', priceAdjustment: 500.00 },
          { value: 'Poster Design', priceAdjustment: 500.00 },
          { value: 'Invitation Card Design', priceAdjustment: 500.00 },
          { value: 'Birthday Invitation Design', priceAdjustment: 500.00 },
          { value: 'Menu Design', priceAdjustment: 500.00 },
          { value: 'Advertisement Design', priceAdjustment: 500.00 },
          { value: 'Brochure Design', priceAdjustment: 1000.00 },
          { value: 'Wedding Invitation Design', priceAdjustment: 1000.00 },
          { value: 'Banner Design', priceAdjustment: 1000.00 },
          { value: 'Roll-up Banner Design', priceAdjustment: 1000.00 },
          { value: 'Product Label Design', priceAdjustment: 1000.00 },
          { value: 'Logo Design', priceAdjustment: 2000.00 },
          { value: 'Packaging Design', priceAdjustment: 2000.00 },
        ],
      },
    },
  });

  // 12 Photocopy & Printout Services & Configurator
  const photocopyPrintoutServices = [
    {
      name: 'A4 Black & White Photocopy – Single Side',
      slug: 'a4-black-and-white-photocopy-single-side',
      sku: 'CI-DOC-01',
      price: 10.00,
      costPrice: 2.00,
      description: 'Standard A4 black & white single-sided document photocopy.',
    },
    {
      name: 'A4 Black & White Photocopy – Double Side',
      slug: 'a4-black-and-white-photocopy-double-side',
      sku: 'CI-DOC-02',
      price: 15.00,
      costPrice: 3.00,
      description: 'A4 black & white double-sided document photocopy.',
    },
    {
      name: 'A4 Colour Photocopy – Single Side',
      slug: 'a4-colour-photocopy-single-side',
      sku: 'CI-DOC-03',
      price: 50.00,
      costPrice: 10.00,
      description: 'Vibrant A4 full-colour single-sided document photocopy.',
    },
    {
      name: 'A4 Colour Photocopy – Double Side',
      slug: 'a4-colour-photocopy-double-side',
      sku: 'CI-DOC-04',
      price: 80.00,
      costPrice: 15.00,
      description: 'Full-colour A4 double-sided document photocopy.',
    },
    {
      name: 'A3 Black & White Photocopy – Single Side',
      slug: 'a3-black-and-white-photocopy-single-side',
      sku: 'CI-DOC-05',
      price: 20.00,
      costPrice: 4.00,
      description: 'Large format A3 black & white single-sided photocopy.',
    },
    {
      name: 'A3 Black & White Photocopy – Double Side',
      slug: 'a3-black-and-white-photocopy-double-side',
      sku: 'CI-DOC-06',
      price: 30.00,
      costPrice: 6.00,
      description: 'Large format A3 black & white double-sided photocopy.',
    },
    {
      name: 'A3 Colour Photocopy – Single Side',
      slug: 'a3-colour-photocopy-single-side',
      sku: 'CI-DOC-07',
      price: 100.00,
      costPrice: 20.00,
      description: 'High-quality A3 full-colour single-sided photocopy.',
    },
    {
      name: 'A3 Colour Photocopy – Double Side',
      slug: 'a3-colour-photocopy-double-side',
      sku: 'CI-DOC-08',
      price: 150.00,
      costPrice: 30.00,
      description: 'High-definition A3 full-colour double-sided photocopy.',
    },
    {
      name: 'A4 Black & White Printout',
      slug: 'a4-black-and-white-printout',
      sku: 'CI-DOC-09',
      price: 10.00,
      costPrice: 2.00,
      description: 'High-speed laser A4 black & white digital document printout.',
    },
    {
      name: 'A4 Colour Printout',
      slug: 'a4-colour-printout',
      sku: 'CI-DOC-10',
      price: 50.00,
      costPrice: 10.00,
      description: 'Vibrant color A4 digital laser document printout.',
    },
    {
      name: 'A3 Black & White Printout',
      slug: 'a3-black-and-white-printout',
      sku: 'CI-DOC-11',
      price: 20.00,
      costPrice: 4.00,
      description: 'Large A3 black & white digital laser printout.',
    },
    {
      name: 'A3 Colour Printout',
      slug: 'a3-colour-printout',
      sku: 'CI-DOC-12',
      price: 100.00,
      costPrice: 20.00,
      description: 'Large format A3 full-colour digital laser printout.',
    },
  ];

  for (const service of photocopyPrintoutServices) {
    await prisma.product.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        price: service.price,
        costPrice: service.costPrice,
        sku: service.sku,
        description: service.description,
        categoryId: categoriesMap['photocopy-and-printouts'],
      },
      create: {
        name: service.name,
        slug: service.slug,
        sku: service.sku,
        categoryId: categoriesMap['photocopy-and-printouts'],
        description: service.description,
        shortDescription: service.description,
        price: service.price,
        costPrice: service.costPrice,
        stock: 99999,
        lowStockThreshold: 100,
        isFeatured: true,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
          ],
        },
      },
    });
  }

  // Main Configurator Product: Photocopy & Printout Services
  const mainDocProd = await prisma.product.upsert({
    where: { slug: 'photocopy-and-printout-services' },
    update: {
      name: 'Photocopy & Printout Services',
      price: 10.00,
      costPrice: 2.00,
      sku: 'CI-DOC-MAIN',
      description: 'Fast and high quality document photocopying and printing in A4 & A3 sizes, B&W or vibrant color, single or double sided.',
      shortDescription: 'Document photocopying & laser printing services in A4 & A3 sizes.',
      categoryId: categoriesMap['photocopy-and-printouts'],
    },
    create: {
      name: 'Photocopy & Printout Services',
      slug: 'photocopy-and-printout-services',
      sku: 'CI-DOC-MAIN',
      categoryId: categoriesMap['photocopy-and-printouts'],
      description: 'Fast and high quality document photocopying and printing in A4 & A3 sizes, B&W or vibrant color, single or double sided.',
      shortDescription: 'Document photocopying & laser printing services in A4 & A3 sizes.',
      price: 10.00,
      costPrice: 2.00,
      stock: 99999,
      lowStockThreshold: 100,
      isFeatured: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=400', orderIndex: 0 },
        ],
      },
    },
  });

  await prisma.productOption.deleteMany({
    where: { productId: mainDocProd.id },
  });

  await prisma.productOption.create({
    data: {
      productId: mainDocProd.id,
      name: 'SERVICE TYPE',
      isRequired: true,
      values: {
        create: [
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
    },
  });

  console.log('Products and customizations seeded.');

  // 5. Site Settings
  const settings = [
    { key: 'site_name', value: 'C.I. Technologies & Color Lab', description: 'Name of the business' },
    { key: 'brand_hashtag', value: '#colorlab99', description: 'Marketing hashtag' },
    { key: 'contact_email', value: 'info@colorlab99.lk', description: 'Public support email' },
    { key: 'contact_phone', value: '+94 77 123 4567', description: 'Main phone number' },
    { key: 'contact_whatsapp', value: '+94 77 123 4567', description: 'WhatsApp Business link' },
    { key: 'store_address', value: '99 Main Street, Colombo, Sri Lanka', description: 'Physical store address' },
    { key: 'opening_hours', value: 'Monday - Saturday: 8.30 AM - 7.00 PM | Sunday: 9.00 AM - 2.00 PM', description: 'Store operating hours' },
    { key: 'bank_details_transfer', value: 'Commercial Bank | C.I. Technologies | Account: 1234567890 | Branch: Colombo Fort', description: 'Bank details for offline transfers' },
    { key: 'announcement_bar', value: 'Premium Printing & Color Lab Services | Islandwide Delivery Available', description: 'Announcement text' },
    { key: 'social_facebook', value: 'https://facebook.com/colorlab99', description: 'Facebook link' },
    { key: 'social_instagram', value: 'https://instagram.com/colorlab99', description: 'Instagram link' },
    { key: 'social_tiktok', value: 'https://tiktok.com/@colorlab99', description: 'TikTok profile link' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: { key: s.key, value: s.value, description: s.description },
    });
  }
  console.log('Site settings seeded.');

  // 6. FAQs
  const faqs = [
    { question: 'What options do I have for photo printing size?', answer: 'We offer standard sizes like 4x6, 5x7, 6x8, 8x12, up to large formats like 12x18 and custom sizes. You can choose gloss or matte photographic papers.', orderIndex: 0 },
    { question: 'How long does delivery take within Sri Lanka?', answer: 'Typically, delivery takes 1-2 days within Colombo, 2-3 days to suburbs (Gampaha/Kalutara), and 3-5 days to other districts.', orderIndex: 1 },
    { question: 'Can I pay on delivery?', answer: 'Yes! We support Cash on Delivery (COD) for most items, Bank Transfers, and Store Pickup with cash/card payment.', orderIndex: 2 },
    { question: 'How do I upload high-quality files for large frames?', answer: 'You can drag and drop your photos on the product configuration page. We support formats up to 50MB including PNG, JPG, PDF, and TIFF. For PSD and raw designs, you can select the files directly.', orderIndex: 3 },
  ];

  for (const f of faqs) {
    await prisma.faq.create({
      data: { question: f.question, answer: f.answer, orderIndex: f.orderIndex },
    });
  }
  console.log('FAQs seeded.');

  // 7. Pages
  const pages = [
    {
      title: 'About Us',
      slug: 'about-us',
      content: 'C.I. Technologies & Color Lab is a premium digital printing, photo framing, and color lab service provider based in Sri Lanka. Under our hashtag #colorlab99, we specialize in high-quality photo prints, customized mug prints, canvas blocks, lamination, and promotional corporate items. With islandwide delivery and state-of-the-art print hardware, we ensure your memories are preserved with vivid colors.',
      seoTitle: 'About C.I. Technologies & Color Lab',
      seoDescription: 'Learn about our journey, high quality standards, and premium photo studio services in Sri Lanka.',
    },
    {
      title: 'Contact Us',
      slug: 'contact-us',
      content: 'Get in touch with us for special design requests, bulk printing, or order tracking queries. Visit us at our main branch or chat with us on WhatsApp.',
      seoTitle: 'Contact #colorlab99 - C.I. Technologies & Color Lab',
      seoDescription: 'Find our contact details, location, phone numbers, and WhatsApp coordinates.',
    },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: { title: p.title, content: p.content, seoTitle: p.seoTitle, seoDescription: p.seoDescription },
      create: { title: p.title, slug: p.slug, content: p.content, seoTitle: p.seoTitle, seoDescription: p.seoDescription },
    });
  }
  console.log('Pages seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
