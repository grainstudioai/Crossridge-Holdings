import React from 'react';
import { ShieldCheck, Award, Star, CheckCircle, ArrowRight, DollarSign, Clock } from 'lucide-react';
import { WHOLESALE_CASE_STUDIES, WHOLESALE_LEGAL_COMPLIANCE } from '../data/wholesaleData';

interface CaseStudiesProps {
  onOpenSellerModal: () => void;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onOpenSellerModal }) => {
  return (
    <section id="case-studies" className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Proven Wholesale Closings & Case Studies</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            How Homeowners Saved Thousands in Fees & Time
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Real families, real numbers. Clean titles delivered through licensed escrow title officers.
          </p>
        </div>

        {/* Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {WHOLESALE_CASE_STUDIES.map((study, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={study.image}
                      alt={study.seller}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-sm"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {study.seller}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {study.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm mb-4">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider mb-1">
                      Distressed Situation:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 text-xs">
                      {study.scenario}
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-[11px] uppercase tracking-wider mb-1">
                      Our Wholesale Solution:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 text-xs">
                      {study.ourSolution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 dark:border-slate-700 text-center text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Time to Cash</span>
                  <span className="font-black text-slate-900 dark:text-white">{study.sellerWalkawayTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Saved in Fees</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{study.sellerCommissionSaved}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Buyer Outcome</span>
                  <span className="font-black text-blue-600 dark:text-blue-400 truncate block">{study.buyerProfit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Title Escrow Partners Logo Strip */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-4">
            Ohio Authorized Escrow & Title Insurance Partners
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            {WHOLESALE_LEGAL_COMPLIANCE.escrowPartners.map((partner, i) => (
              <div key={i} className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
