import React from 'react';
import { Award, Clock, Printer, ShieldCheck } from 'lucide-react';
import { siteSettings } from '@/data/settings';

export default function AboutPage() {
  const isSuperAdmin = false;
  const settings = siteSettings;

  const title = 'About C.I. Technologies & Color Lab';
  const content = 'C.I. Technologies & Color Lab is a premium digital printing, photo framing, and color lab service provider based in Sri Lanka. Under our hashtag #colorlab99, we specialize in high-quality photo prints, customized mug prints, canvas blocks, lamination, and promotional corporate items. With islandwide delivery and state-of-the-art print hardware, we ensure your memories are preserved with vivid colors.';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 min-h-screen relative">

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-dark tracking-tight">{title}</h1>
        <p className="text-xs sm:text-sm text-primary uppercase font-bold tracking-widest">Preserving Memories, Digitally & Physically</p>
      </div>

      <div className="bg-white border border-gray-border rounded-2xl p-6 sm:p-6 shadow-xs leading-relaxed space-y-6">
        <p className="text-sm text-dark font-medium whitespace-pre-line">
          {content}
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
