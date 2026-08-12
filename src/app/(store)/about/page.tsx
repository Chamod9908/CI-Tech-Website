import React from 'react';
import { prisma } from '@/lib/db';
import { Award, Clock, Printer, ShieldCheck, Edit } from 'lucide-react';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export const revalidate = 0;

export default async function AboutPage() {
  const session = await getSession();
  const isSuperAdmin = session?.role === 'SUPER_ADMIN';

  const page = await prisma.page.findUnique({
    where: { slug: 'about-us' },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 min-h-screen relative">
      {isSuperAdmin && (
        <div className="absolute top-2 right-4 z-20">
          <Link href="/admin/settings">
            <span className="cursor-pointer bg-white border border-gray-border hover:border-primary text-dark hover:text-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs">
              <Edit size={14} className="text-primary" /> Edit Page Settings
            </span>
          </Link>
        </div>
      )}

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-dark tracking-tight">{page?.title || 'About Our Studio'}</h1>
        <p className="text-xs sm:text-sm text-primary uppercase font-bold tracking-widest">Preserving Memories, Digitally & Physically</p>
      </div>

      <div className="bg-white border border-gray-border rounded-2xl p-6 sm:p-6 shadow-xs leading-relaxed space-y-6">
        <p className="text-sm text-dark font-medium whitespace-pre-line">
          {page?.content || 'C.I. Technologies & Color Lab is a premier print studio and custom framing provider in Sri Lanka.'}
        </p>
      </div>

      {/* Brand value propositions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6">
        <div className="bg-bg-light border border-gray-100 rounded-xl p-5 text-center space-y-2">
          <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
            <Printer size={22} />
          </div>
          <h4 className="font-extrabold text-sm text-dark">High-Density Ink</h4>
          <p className="text-[10px] text-gray-text">True-to-life tones, deep blacks, and sharp contours.</p>
        </div>

        <div className="bg-bg-light border border-gray-100 rounded-xl p-5 text-center space-y-2">
          <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
            <Award size={22} />
          </div>
          <h4 className="font-extrabold text-sm text-dark">Wood Frames</h4>
          <p className="text-[10px] text-gray-text">Authentic solid wood borders with moisture backing.</p>
        </div>

        <div className="bg-bg-light border border-gray-100 rounded-xl p-5 text-center space-y-2">
          <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
            <Clock size={22} />
          </div>
          <h4 className="font-extrabold text-sm text-dark">Quick Turnaround</h4>
          <p className="text-[10px] text-gray-text">Fast order review, production tracking, and dispatch.</p>
        </div>

        <div className="bg-bg-light border border-gray-100 rounded-xl p-5 text-center space-y-2">
          <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
            <ShieldCheck size={22} />
          </div>
          <h4 className="font-extrabold text-sm text-dark">Quality Checks</h4>
          <p className="text-[10px] text-gray-text">Inspected by print specialists before delivery dispatch.</p>
        </div>
      </div>
    </div>
  );
}
