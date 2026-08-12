import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "C.I. Technologies & Color Lab | Premium Photo Printing & Frames",
    template: "%s | C.I. Technologies & Color Lab",
  },
  description: "Professional photo printing, color lab services, personalized gifts, custom photo frames and digital business printing in Sri Lanka. #colorlab99",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "C.I. Technologies & Color Lab | #colorlab99",
    description: "Premium printing, photo framing, mugs, and customized gifts with islandwide delivery in Sri Lanka.",
    type: "website",
    locale: "en_LK",
  },
};

import { getAllSiteSettings } from "@/lib/settings";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getAllSiteSettings();
  const primaryColor = settings.primary_color || '#f97316';
  const announcementBarBg = settings.announcement_bar_bg || '#f97316';

  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <style id="colorlab-theme" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-primary: ${primaryColor} !important;
            --color-primary-hover: ${primaryColor} !important;
            --color-announcement: ${announcementBarBg} !important;
          }
        `}} />
      </head>
      <body suppressHydrationWarning className="bg-white text-dark min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
