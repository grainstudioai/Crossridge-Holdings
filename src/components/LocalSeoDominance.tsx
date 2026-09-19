import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Building2,
  Scale,
  ArrowRight,
  ChevronDown,
  Clock,
  DollarSign
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

  const ohioFaqs = [
    {
      q: `Can I legally sell or wholesale real estate in Ohio without a realtor license?`,
      a: `Yes. In Ohio, property owners have the unrestricted right to sell their property directly to private buyers. Under Ohio Revised Code (ORC) Chapter 4735, wholesaling real estate via equitable interest assignment is 100% lawful when properly structured. Crossridge Holdings LLC acquires legal and equitable interest through a signed bilateral purchase agreement as a principal buyer, marketing and assigning our contractual rights with full statutory transparency. All escrow is held with licensed Ohio title insurance underwriters.`,
    },
    {
      q: `How fast can Crossridge Holdings LLC close on my house in Ohio?`,
      a: `We close in as few as 7 business days across Ohio. Because we purchase with private cash capital, there are zero bank underwriting delays, mortgage contingency clauses, or lender appraisals. As soon as our neutral Ohio title agency (e.g. First American Title Ohio or Chicago Title) conducts the municipal lien and title search, escrow funds are wired directly to you.`,
    },
    {
      q: `Do I need to pay any real estate commissions, cleaning fees, or Ohio transfer taxes?`,
      a: `Zero. Traditional Ohio MLS listings cost homeowners 5% to 6% in agent commissions plus conveyance fees and transfer closing costs. When working with Crossridge Holdings LLC, you pay $0 in realtor commissions, $0 in fees, and sell 100% AS-IS. You never need to clean, paint, or make repairs.`,
    },
    {
      q: `What major Ohio cities and counties does Crossridge Holdings LLC buy in?`,
      a: `We purchase houses statewide across all 88 Ohio counties. Our highest-volume submarkets include Franklin County (Columbus), Cuyahoga County (Cleveland), Hamilton County (Cincinnati), Montgomery County (Dayton), Lucas County (Toledo), Summit County (Akron), Stark County (Canton), and Mahoning County (Youngstown).`,
    },
    {
      q: `How is the cash offer calculated for an Ohio property?`,
      a: `We review the property, recent comparable sales, and its condition to determine whether it may fit criteria from investors in our network. This straightforward evaluation ensures clear communication, realistic expectations, and a transparent cash offer without guesswork.`,
    }
  ];

  return (
    <section id="local-seo" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Ohio Market Authority & ORC Compliance</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Statewide Wholesaling Authority & City Centers
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Direct cash home buying and equitable assignment acquisitions across Ohio’s premier metropolitan corridors and all 88 counties.
          </p>
        </div>

        {/* Major Cities in Ohio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metros.map((m) => {
            const isSelected = m.id === selectedMetro.id;
            return (
              <div
                key={m.id}
                onClick={() => onSelectMetro(m)}
                className={`group relative rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-2 border-amber-500 shadow-lg shadow-amber-500/10 -translate-y-1'
                    : 'bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-amber-400/50 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5" />
                      {m.name}, OH
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {m.activeDealsCount} Active Deals
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors mb-1">
                    {m.name} Metro
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    {m.tagline}
                  </p>

                  <div className="space-y-2 py-3 border-y border-slate-100 dark:border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400">
                        <DollarSign className="w-3 h-3 text-amber-500" />
                        Median ARV:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ${m.medianARV.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-emerald-500" />
                        Avg Close:
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {m.avgDaysToAssign} - 7 Days
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Discount spread:</span>
                      <span className="font-bold text-amber-500">
                        {m.avgDiscountPct}% below ARV
                      </span>
                    </div>
                  </div>

                  {/* Active Zip Codes */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Key Cash Zip Codes:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {m.popularZipCodes.slice(0, 4).map((zip) => (
                        <span
                          key={zip}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                        >
                          {zip}
                        </span>
                      ))}
                      <span className="text-[10px] text-slate-400 self-center">
                        +more
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSellerModal(m.name, 'OH');
                  }}
                  className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-800 dark:text-slate-200 font-bold py-2 px-3 rounded-xl text-xs transition-colors"
                >
                  <span>Get Your Cash Offer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Ohio Statutory Compliance Callout Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 mb-12 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Ohio Revised Code (ORC) Chapter 4735 Compliant Acquisitions</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Legally Sound & Transparent Ohio Wholesaling Operations
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Crossridge Holdings LLC contracts as a direct principal with valid equitable interest. All escrow deposits and title insurance are governed by licensed Ohio title agencies adhering strictly to Ohio Department of Insurance regulations.
              </p>
            </div>

            <div className="shrink-0">
              <button
                onClick={() => onOpenSellerModal('Columbus', 'OH')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-transform hover:scale-[1.02]"
              >
                <span>Get Your Cash Offer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Real Estate Wholesaling Rich FAQ for Ohio */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Frequently Asked Questions About Selling Your House in Ohio
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Transparent answers about Ohio cash home buying, as-is sales, and equitable assignment laws.
            </p>
          </div>

          <div className="space-y-3">
            {ohioFaqs.map((faq, index) => {
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
