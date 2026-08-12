import { Role, OrderStatus, PaymentStatus, DeliveryMethod, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/db';

async function main() {
  console.log('Seeding started...');

  // Hashed Passwords
  const superAdminPassword = await bcrypt.hash('superadmin123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const managerPassword = await bcrypt.hash('manager123', 10);
  const designerPassword = await bcrypt.hash('designer123', 10);
  const productionPassword = await bcrypt.hash('production123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  // 1. Users & Staff
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@colorlab.lk' },
    update: {},
    create: {
      email: 'superadmin@colorlab.lk',
      name: 'Super Admin User',
      passwordHash: superAdminPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@colorlab.lk' },
    update: {},
    create: {
      email: 'admin@colorlab.lk',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@colorlab.lk' },
    update: {},
    create: {
      email: 'manager@colorlab.lk',
      name: 'Manager User',
      passwordHash: managerPassword,
      role: Role.MANAGER,
    },
  });

  const designer = await prisma.user.upsert({
    where: { email: 'designer@colorlab.lk' },
    update: {},
    create: {
      email: 'designer@colorlab.lk',
      name: 'Designer User',
      passwordHash: designerPassword,
      role: Role.DESIGNER,
    },
  });

  const production = await prisma.user.upsert({
    where: { email: 'production@colorlab.lk' },
    update: {},
    create: {
      email: 'production@colorlab.lk',
      name: 'Production Worker',
      passwordHash: productionPassword,
      role: Role.PRODUCTION_EMPLOYEE,
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@gmail.com' },
    update: {},
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
      update: {},
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
