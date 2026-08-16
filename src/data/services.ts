export interface ServiceData {
  id: string;
  title: string;
  slug: string;
  categorySlug: string;
  iconName?: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  imageUrl: string;
  startingPrice: string;
}

export const services: ServiceData[] = [
  {
    id: 'srv-1',
    title: 'Photo Printing & Lab Services',
    slug: 'photo-printing',
    categorySlug: 'photo-printing',
    iconName: 'Printer',
    shortDescription: 'High-definition digital photo lab printouts in matte, glossy, and satin finishes.',
    fullDescription: 'We utilize industry-leading high-resolution laser and silver halide photo print lab machinery to deliver rich color depth, sharp edges, and true-to-life skin tones. From standard 4x6 snapshots to jumbo 20x30 gallery posters.',
    features: ['High-density photo paper', 'Vivid RGB color lab calibration', 'Glossy, Matte & Satin finishes', 'Sizes from 4x6 to 20x30 inches'],
    imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600',
    startingPrice: 'Rs. 40.00',
  },
  {
    id: 'srv-2',
    title: 'Custom Photo Print & Framing',
    slug: 'photo-framing',
    categorySlug: 'photo-print-and-frame-complete',
    iconName: 'Award',
    shortDescription: 'Complete custom wooden, black, white, and glass photo frames.',
    fullDescription: 'Handcrafted photo frames built with premium wooden mouldings, clear anti-glare glass options, and durable backing. Preserve family portraits, wedding photos, and certificates elegantly.',
    features: ['Teak wood, Black, White & Antique Gold finishes', 'Anti-glare matt glass option', 'Complete ready-to-hang assembly', 'Custom sizes tailored to your space'],
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600',
    startingPrice: 'Rs. 1,200.00',
  },
  {
    id: 'srv-3',
    title: 'Digital Photo Editing & Restoration',
    slug: 'photo-editing',
    categorySlug: 'photo-editing-and-retouching',
    iconName: 'Edit',
    shortDescription: 'Restoration of old, damaged, or faded photos and professional retouching.',
    fullDescription: 'Our expert digital design team restores scratched, torn, water-damaged, or faded vintage photographs. We also offer studio retouching, portrait background replacement, and colorization.',
    features: ['Old & torn photo repair', 'Black & white photo colorization', 'Background cleanup & replacement', 'High-res digital file delivery'],
    imageUrl: 'https://images.unsplash.com/photo-1542744094-3a317272018a?auto=format&fit=crop&q=80&w=600',
    startingPrice: 'Rs. 500.00',
  },
  {
    id: 'srv-4',
    title: 'Personalized Mugs & Gift Items',
    slug: 'mug-printing',
    categorySlug: 'mug-printing',
    iconName: 'Heart',
    shortDescription: 'Custom photo mugs, color-changing magic mugs, and personalized corporate gifts.',
    fullDescription: 'Dishwasher and microwave safe high-quality ceramic mugs. Print your memorable photos, company logos, quotes, or custom graphic artwork.',
    features: ['Magic color-changing options', 'High temperature sublimation printing', 'Single or double-side prints', 'Custom box packaging available'],
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    startingPrice: 'Rs. 950.00',
  },
  {
    id: 'srv-5',
    title: 'Document Photocopy & Printout Services',
    slug: 'photocopy-and-printouts',
    categorySlug: 'photocopy-and-printouts',
    iconName: 'Printer',
    shortDescription: 'Laser document copying and printing in A4 and A3 sizes.',
    fullDescription: 'Fast high-volume document printing and photocopy services. High precision digital laser printers for sharp text and vibrant charts.',
    features: ['A4 and A3 paper formats', 'Black & white and full-color prints', 'Single or double-sided copying', 'Binding & laminating services'],
    imageUrl: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=600',
    startingPrice: 'Rs. 10.00',
  },
];
