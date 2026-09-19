import React from 'react';
import { ArrowRight, ClipboardEdit, SearchCheck, CheckCircle2 } from 'lucide-react';

interface TheProcessProps {
  onOpenSellerModal: () => void;
}

export const TheProcess: React.FC<TheProcessProps> = ({ onOpenSellerModal }) => {
  const steps = [
    {
      number: '01',
      title: 'Tell Us About Your Property',
      description: 'Share the property address and a few basic details. It takes about two minutes.',
      icon: ClipboardEdit,
      tag: 'Fast & Simple',
    },
    {
      number: '02',
      title: 'We Review the Property',
      description:
        'We review the property, recent comparable sales, and its condition to determine whether it may fit criteria from investors in our network.',
      icon: SearchCheck,
      tag: 'Comprehensive Valuation',
    },
    {
      number: '03',
      title: "Move Forward If There's a Fit",
      description:
        "If appropriate, we'll work through the transaction structure together, which may include assigning the purchase agreement to an interested investor.",
      icon: CheckCircle2,
      tag: 'Transparent Closing',
    },
  ];

  return (
    <section id="the-process-section" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <ClipboardEdit className="w-3.5 h-3.5" />
            <span>The Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            A three-step straightforward path from property submission to closing.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition-all group"
              >
                <div>
                  {/* Step Number & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="text-4xl sm:text-5xl font-black text-amber-500/30 dark:text-amber-400/20 group-hover:text-amber-500 transition-colors font-mono">
                      {step.number}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <Icon className="w-3 h-3" />
                      {step.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Step {idx + 1} of 3</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary CTA */}
        <div className="text-center">
          <button
            onClick={onOpenSellerModal}
            id="the-process-get-offer-btn"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black px-8 sm:px-10 py-4 rounded-xl text-sm sm:text-base shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Your Cash Offer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 font-medium">
            No Pressure. No Obligations. No Commission
          </p>
        </div>
      </div>
    </section>
  );
};
