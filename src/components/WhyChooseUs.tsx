import React from 'react';
import { Zap, FileCheck, Handshake, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

interface WhyChooseUsProps {
  onOpenSellerModal: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenSellerModal }) => {
  const pointers = [
    {
      id: 'direct-process',
      title: 'A more direct process than listing publicly',
      detail:
        'Skip months of open houses, weekend staging, public MLS walkthroughs, and buyer financing fallout. We provide a direct, streamlined avenue to sell on your schedule.',
      icon: Zap,
      accent: 'amber',
      tag: 'Speed & Directness',
    },
    {
      id: 'clear-terms',
      title: 'Clear terms explained before you decide',
      detail:
        'We believe in total transparency. Every line item, timeline, and purchase calculation is walked through clearly so you never encounter surprise fees or hidden concessions.',
      icon: FileCheck,
      accent: 'emerald',
      tag: 'Full Transparency',
    },
    {
      id: 'upfront-assignment',
      title: 'Upfront if the agreement will be assigned to an investor',
      detail:
        'We never disguise our business model. In compliance with Ohio Revised Code Chapter 4735, we disclose upfront whenever an equitable assignment will be utilized to match your property with a qualified end investor.',
      icon: Handshake,
      accent: 'blue',
      tag: 'Statutory Disclosure',
    },
    {
      id: 'no-obligation',
      title: 'No obligation to accept',
      detail:
        'Requesting an offer or discussing your property costs you nothing. You remain in complete control with zero high-pressure sales tactics and zero obligation to move forward.',
      icon: Shield,
      accent: 'purple',
      tag: 'Zero Pressure',
    },
  ];

  return (
    <section id="why-choose-us-section" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Core Principles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Choose Us
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            A reliable, principal-driven approach designed around seller convenience and legal transparency.
          </p>
        </div>

        {/* 4 Pointers Grid with relevant visual elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {pointers.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    {/* Relevant Visual Element before pointer */}
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2.5 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Crossridge Guarantee</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenSellerModal}
            id="why-choose-us-cta-btn"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold px-7 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02]"
          >
            <span>See How We Can Help With Your Property</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
