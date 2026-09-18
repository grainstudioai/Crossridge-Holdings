import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Building2,
  FileCheck,
  TrendingUp,
  Scale,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { MetroMarket } from '../types';

interface LocalSeoDominanceProps {
  metros: MetroMarket[];
  selectedMetro: MetroMarket;
  onSelectMetro: (m: MetroMarket) => void;
  onOpenSellerModal: (city: string, state: string) => void;
}

export const LocalSeoDominance: React.FC<LocalSeoDominanceProps> = ({
  metros,
  selectedMetro,
  onSelectMetro,
  onOpenSellerModal,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const localFaqs = [
    {
      q: `Can I legally wholesale real estate in ${selectedMetro.state} without a realtor license?`,
      a: `Yes. In ${selectedMetro.state} and nationwide, wholesaling real estate via equitable interest assignment is 100% legal. When you sign a valid bilateral Purchase and Sale Agreement with a homeowner, you acquire "equitable interest" in the contract. You are legally marketing and assigning your contractual rights to an end buyer for an assignment fee, in full accordance with statutory disclosure rules (such as Texas Occupations Code § 1101.0045, Florida Real Estate Commission rules, etc.).`,
    },
    {
      q: `How fast can I receive cash for my house in ${selectedMetro.name}?`,
      a: `Our standard title escrow closing period in ${selectedMetro.name}, ${selectedMetro.state} is between 7 and 14 business days. Because we purchase all-cash with zero lender mortgage underwriting or appraisal contingencies, closing can occur as soon as our neutral title company (e.g. Fidelity National Title or First American Title) completes the municipal lien search.`,
    },
    {
      q: `Do I need to pay any real estate commissions, cleaning fees, or repair costs?`,
      a: `Zero. Traditional MLS listings charge you 5% to 6% in agent commissions plus 2% to 3% in seller transfer closing costs. When selling to US Equitrade Wholesale, you pay $0 in commissions, $0 in closing fees (we cover 100%), and you sell 100% AS-IS. You do not need to clean, paint, or remove unwanted junk.`,
    },
    {
      q: `What is the difference between a wholesaler and a real estate agent?`,
      a: `A real estate agent lists your house on the public MLS, schedules dozens of public walk-throughs, requires inspection repairs, and takes 60-90+ days while charging thousands in commissions. A wholesaler contracts to purchase your house directly for cash as a principal, absorbing all market risk and assigning the contract to their vetted cash investor network with guaranteed certainty.`,
    },
    {
      q: `How is the cash offer calculated in ${selectedMetro.name}?`,
      a: `We utilize the standard institutional 70% Wholesaling Formula: Maximum Allowable Offer (MAO) = (After-Repair Value [ARV] × 70%) minus Estimated Contractor Rehab Costs minus our standard assignment spread. This provides the seller instant cash certainty while leaving sufficient margin for the rehab team.`,
    }
  ];

  return (
    <section id="local-seo" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Local SEO Hub & Wholesale Legality</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Nationwide Wholesaling Authority & City Centers
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Targeting the top high-yield real estate wholesaling metro corridors with compliant equitable assignment structures.
          </p>
        </div>

        {/* Metro Pills Grid */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {metros.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMetro(m)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                m.id === selectedMetro.id
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{m.name}, {m.state}</span>
            </button>
          ))}
        </div>

        {/* Active Metro Deep Dive Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: SEO Headline & Description (7 cols) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                <Building2 className="w-4 h-4" />
                <span>We Buy Distressed Houses Cash In {selectedMetro.name}, {selectedMetro.state}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                Sell My House Fast in {selectedMetro.name} — Direct Wholesaler Cash Buyer
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Need to sell your house in <strong>{selectedMetro.name}</strong> without paying 6% agent commissions, open houses, or staging costs? We provide institutional-grade wholesale cash acquisitions for probate, foreclosure, inherited properties, and heavy fixer-uppers throughout <strong>{selectedMetro.name} and surrounding county corridors</strong>.
              </p>

              {/* Local Zip Codes Directory */}
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                  Active Wholesale Cash Buying Zip Codes in {selectedMetro.shortCode}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMetro.popularZipCodes.map((zip) => (
                    <span
                      key={zip}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      {zip}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400">
                    + All Greater County Parcels
                  </span>
                </div>
              </div>

              {/* Local Action Button */}
              <button
                onClick={() => onOpenSellerModal(selectedMetro.name.split('-')[0], selectedMetro.state)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-transform hover:scale-[1.01]"
              >
                <span>Request {selectedMetro.shortCode} Cash Offer Memorandum</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: City Market Pulse Metrics (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {selectedMetro.name} Wholesale Economics
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Median Submarket ARV</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    ${selectedMetro.medianARV.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Average Wholesale Discount</span>
                  <span className="text-base font-black text-amber-500">
                    {selectedMetro.avgDiscountPct}% Off ARV
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Contract Escrow Velocity</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {selectedMetro.avgDaysToAssign} Business Days
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Active Wholesale Deals</span>
                  <span className="text-base font-black text-blue-600 dark:text-blue-400">
                    {selectedMetro.activeDealsCount} Under Contract
                  </span>
                </div>
              </div>

              {/* State Wholesaling Legal Citation */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{selectedMetro.state} Statutory Wholesaling Compliance:</span>
                </div>
                <p>
                  Fully adheres to {selectedMetro.state} equitable interest marketing disclosure statutes. Neutral escrow held with local authorized title underwriters.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real Estate Wholesaling Rich FAQ (Schema-ready) */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Frequently Asked Questions About US Real Estate Wholesaling
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Transparent answers for homeowners, flippers, and cash investors.
            </p>
          </div>

          <div className="space-y-3">
            {localFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-amber-500' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
