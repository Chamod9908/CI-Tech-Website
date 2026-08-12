import React from 'react';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsForm from '@/components/admin/SettingsForm';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const session = await getSession();
  
  // Guard access: restrict to staff
  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
  }

  // Fetch all site settings
  const settingsList = await prisma.siteSetting.findMany();
  const settingsMap: Record<string, string> = {};
  settingsList.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  // Fetch all FAQs
  const faqs = await prisma.faq.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  const plainFaqs = faqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">System Settings</h1>
        <p className="text-xs sm:text-sm text-gray-text mt-1">
          Configure branding, hashtags, phone numbers, page layout designs, and payment credentials.
        </p>
      </div>

      <SettingsForm initialSettings={settingsMap} initialFaqs={plainFaqs} />
    </div>
  );
}
