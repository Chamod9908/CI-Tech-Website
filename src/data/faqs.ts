export interface FaqData {
  id: string;
  question: string;
  answer: string;
  orderIndex: number;
  isEnabled: boolean;
}

export const faqs: FaqData[] = [
  {
    id: 'faq-1',
    question: 'What options do I have for photo printing size?',
    answer: 'We offer standard sizes like 4x6, 5x7, 6x8, 8x12, up to large formats like 12x18 and custom sizes. You can choose gloss or matte photographic papers.',
    orderIndex: 0,
    isEnabled: true,
  },
  {
    id: 'faq-2',
    question: 'How long does delivery take within Sri Lanka?',
    answer: 'Typically, delivery takes 1-2 days within Colombo, 2-3 days to suburbs (Gampaha/Kalutara), and 3-5 days to other districts.',
    orderIndex: 1,
    isEnabled: true,
  },
  {
    id: 'faq-3',
    question: 'Can I pay on delivery?',
    answer: 'Yes! We support Cash on Delivery (COD) for most items, Bank Transfers, and Store Pickup with cash/card payment.',
    orderIndex: 2,
    isEnabled: true,
  },
  {
    id: 'faq-4',
    question: 'How do I upload high-quality files for large frames?',
    answer: 'You can drag and drop your photos on the product configuration page. We support formats up to 50MB including PNG, JPG, PDF, and TIFF.',
    orderIndex: 3,
    isEnabled: true,
  },
];
