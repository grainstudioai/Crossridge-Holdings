import React, { useState } from 'react';
import { Sparkles, ArrowRight, Shield, CheckCircle2, Clock, DollarSign, Home, TrendingUp, Zap, HelpCircle, Phone } from 'lucide-react';
import { MetroMarket } from '../types';

interface HeroProps {
  selectedMetro: MetroMarket;
  onStartValuation: (address: string, city: string, state: string) => void;
  onOpenBuyerModal: () => void;
  onNavigateToMap?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedMetro,
  onStartValuation,
  onOpenBuyerModal,
}) => {
  const [addressInput, setAddressInput] = useState('');
  const [modeTab, setModeTab] = useState<'seller' | 'investor'>('seller');

  const popularSampleAddresses: Record<string, { address: string; city: string; state: string }> = {
    columbus: { address: '435 E Livingston Ave', city: 'Columbus', state: 'OH' },
    cleveland: { address: '3245 W 130th St', city: 'Cleveland', state: 'OH' },
    cincinnati: { address: '3421 Glenmore Ave', city: 'Cincinnati', state: 'OH' },
    dayton: { address: '1824 Wayne Ave', city: 'Dayton', state: 'OH' },
    toledo: { address: '2144 Sylvania Ave', city: 'Toledo', state: 'OH' },
    akron: { address: '915 W Exchange St', city: 'Akron', state: 'OH' },
    canton: { address: '1422 Cleveland Ave NW', city: 'Canton', state: 'OH' },
    youngstown: { address: '2804 Mahoning Ave', city: 'Youngstown', state: 'OH' },
  };

  const currentSample = popularSampleAddresses[selectedMetro.id] || {
    address: '435 E Livingston Ave',
    city: 'Columbus',
    state: 'OH',
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAddress = addressInput.trim() || currentSample.address;
    onStartValuation(cleanAddress, currentSample.city, currentSample.state);
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-6 sm:pt-10 pb-16 lg:pb-24 border-b border-slate-200 dark:border-slate-800">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] pointer-events-none" />
      <div className="absolute -top-40 right-0 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Dual Audience Toggle (Seller vs Cash Investor) */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner">
            <button
              onClick={() => setModeTab('seller')}
              id="hero-tab-seller"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                modeTab === 'seller'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>I Want To Sell My Ohio House (Cash Offer)</span>
            </button>
            <button
              onClick={() => setModeTab('investor')}
              id="hero-tab-investor"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                modeTab === 'investor'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>I Am A Cash Buyer / Investor</span>
            </button>
          </div>
        </div>

        {/* Content for Motivated Sellers */}
        {modeTab === 'seller' ? (
          <div className="max-w-4xl mx-auto text-center">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 mb-4">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Direct Cash Home Buyer in Ohio • Crossridge Holdings LLC</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-5">
              Sell Your Ohio House As-Is In 7 Days.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700">
                Zero Fees. No Repairs. All Cash.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              Skip traditional 6% realtor commissions, months of open houses, and expensive repairs. We review the property, recent comparable sales, and its condition to determine investor fit and provide a straightforward cash offer across Ohio.
            </p>

            {/* High-Converting Address Search Bar */}
            <div className="bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 max-w-2xl mx-auto mb-8 ring-4 ring-amber-500/10">
              <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Home className="w-5 h-5 text-amber-500" />
                  </div>
                  <input
                    type="text"
                    id="hero-address-input"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder={`Enter your street address (e.g. ${currentSample.address}, ${currentSample.city}, ${currentSample.state})`}
                    className="w-full pl-11 pr-4 py-3.5 text-sm sm:text-base font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  id="hero-get-offer-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Get Your Cash Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Seller Value Pillars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Zero Fees</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">No 6% agent commission or hidden closing fees.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">As-Is Purchase</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Leave unwanted furniture, trash, and leaks behind.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">7-Day Closing</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Close whenever you want; immediate cash payout.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">100% Guaranteed</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Escrow deposits backed by verified proof of funds.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Content for Cash Buyers / Investors */
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Exclusive Off-Market Ohio Wholesaling Inventory</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-5">
              Acquire Ohio Contracts at{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600">
                30% to 45% Below ARV
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              We contract direct with motivated Ohio property owners. Lock in equitable assignment contracts ready for immediate closing or assignment transfer across Ohio.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
              <button
                onClick={onOpenBuyerModal}
                id="hero-join-buyer-vip-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold px-7 py-3.5 rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
              >
                <span>Join VIP Cash Buyers Network (Ohio Metros)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:8885822274"
                id="hero-call-investor-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold px-7 py-3.5 rounded-xl text-sm sm:text-base border border-slate-300 dark:border-slate-700 transition-all hover:scale-[1.02] shadow-sm"
              >
                <Phone className="w-4 h-4 text-amber-500 fill-current" />
                <span>Call (888) 582-2274</span>
              </a>
            </div>

            {/* Investor Key Stats */}
            <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <div className="text-xl sm:text-2xl font-black text-amber-500">{selectedMetro.avgDiscountPct}%</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Avg ARV Discount</div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <div className="text-xl sm:text-2xl font-black text-emerald-500">{selectedMetro.avgDaysToAssign} Days</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Avg Contract Velocity</div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
                <div className="text-xl sm:text-2xl font-black text-blue-500">${(selectedMetro.medianARV / 1000).toFixed(0)}k</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Median Submarket ARV</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
