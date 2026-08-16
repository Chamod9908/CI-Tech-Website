import React from 'react';
import Link from 'next/link';
import { CheckCircle, MessageCircle, FileText, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { siteSettings } from '@/data/settings';

interface SuccessPageProps {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.orderNumber || 'CI-10000';
  const settings = siteSettings;
  const whatsappNumber = settings.contact_whatsapp || '+94771234567';

  // Build WhatsApp template
  const textMsg = `Hi C.I. Technologies, I just placed order ${orderNumber} on your website and would like to confirm my prints.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(textMsg)}`;

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      
      {/* Visual Indicator */}
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle size={44} />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-dark tracking-tight">Order Placed Successfully!</h1>
        <p className="text-xs text-gray-text uppercase font-bold tracking-widest">
          Thank you for choosing C.I. Technologies & Color Lab
        </p>
      </div>

      {/* Invoice Reference details */}
      <div className="bg-bg-light border border-gray-border rounded-2xl p-6 space-y-4">
        <div>
          <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider block">Your Order Reference Number</span>
          <span className="text-2xl font-black text-primary tracking-tight">{orderNumber}</span>
        </div>
        <p className="text-xs text-gray-text leading-relaxed">
          We have registered your print configurations and uploaded files. If you chose **Bank Transfer**, please send us a screenshot of the payment receipt via WhatsApp along with this reference number.
        </p>
      </div>

      {/* Primary Call to Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="outline" className="w-full text-green-600 border-green-200 hover:bg-green-50 font-bold gap-2">
            <MessageCircle size={18} /> Coordinate on WhatsApp
          </Button>
        </a>

        <Link href={`/tracking?orderNumber=${orderNumber}`} className="flex-1">
          <Button variant="primary" className="w-full font-bold gap-2">
            <FileText size={18} /> Track Order Status
          </Button>
        </Link>
      </div>

      <div className="pt-4">
        <Link href="/shop" className="text-xs font-bold text-gray-text hover:text-primary uppercase tracking-wider flex items-center justify-center gap-1">
          Continue Shopping <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
}
