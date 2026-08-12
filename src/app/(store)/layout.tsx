import React from 'react';
import { StoreProvider } from '@/context/StoreContext';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { getSession } from '@/lib/auth';
import { getAllSiteSettings } from '@/lib/settings';

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const settings = await getAllSiteSettings();
  const announcement = settings.announcement_bar || '';

  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Header session={session} announcement={announcement} settings={settings} />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer settings={settings} />
      </div>
    </StoreProvider>
  );
}
