import React from 'react';
import { siteSettings } from '@/data/settings';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

export default function ContactPage() {
  const settings = siteSettings;
  const address = settings.store_address || '99 Main Street, Colombo, Sri Lanka';
  const phone = settings.contact_phone || '+94 77 123 4567';
  const email = settings.contact_email || 'info@colorlab99.lk';
  const hours = settings.opening_hours || 'Monday - Saturday: 8.30 AM - 7.00 PM';
  const whatsappNumber = settings.contact_whatsapp || '+94771234567';

  // Build WhatsApp template
  const textMsg = `Hi C.I. Technologies, I have a custom design request and would like to get in touch.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(textMsg)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen relative">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-dark tracking-tight">Get in Touch</h1>
        <p className="text-xs sm:text-sm text-gray-text mt-1.5">
          Have a bulk print request or need custom sizing frames? Reach out to our design coordinators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Contact details */}
        <div className="space-y-6 bg-white border border-gray-border rounded-2xl p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-extrabold text-dark tracking-tight border-l-4 border-primary pl-2.5">Store Directory</h3>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-text font-bold uppercase tracking-wider">Our Branch Location</p>
                <p className="text-sm font-semibold text-dark mt-0.5">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-text font-bold uppercase tracking-wider">Call Coordinates</p>
                <p className="text-sm font-semibold text-dark mt-0.5">{phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-text font-bold uppercase tracking-wider">Email Correspondence</p>
                <p className="text-sm font-semibold text-dark mt-0.5 truncate">{email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-text font-bold uppercase tracking-wider">Operating Hours</p>
                <p className="text-sm font-semibold text-dark mt-0.5 leading-relaxed">{hours}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95"
            >
              <MessageSquare size={18} /> Chat Live on WhatsApp
            </a>
          </div>
        </div>

        {/* Messaging Inquiry Form */}
        <div className="bg-white border border-gray-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-lg font-extrabold text-dark tracking-tight border-l-4 border-primary pl-2.5">Send a Message</h3>
          
          <form className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Your Name" placeholder="e.g. Ishan" required />
              <Input label="Email Address" type="email" placeholder="e.g. ishan@gmail.com" required />
            </div>
            <Input label="Subject / Topic" placeholder="e.g. Custom Frame Quote" required />
            <Textarea label="Your Message / Request details" placeholder="Describe your print dimensions or specific instructions..." required />
            <Button type="submit" variant="primary" className="w-full font-bold gap-2 py-3">
              Send Message <Send size={16} />
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
