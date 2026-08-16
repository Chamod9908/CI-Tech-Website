import React from 'react';
import { StoreProvider } from '@/context/StoreContext';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import FloatingWhatsApp from '@/components/storefront/FloatingWhatsApp';
import { siteSettings } from '@/data/settings';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = siteSettings;
  const announcement = settings.announcement_bar || '';

  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white relative">
        <Header session={null} announcement={announcement} settings={settings as unknown as Record<string, string>} />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer settings={settings as unknown as Record<string, string>} />
        <FloatingWhatsApp whatsappNumber={settings.contact_whatsapp} />
      </div>
    </StoreProvider>
  );
}
