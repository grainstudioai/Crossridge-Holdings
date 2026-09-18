import React, { useState } from 'react';
import { Sparkles, ArrowRight, Shield, CheckCircle2, Clock, DollarSign, Home, TrendingUp, Zap, HelpCircle } from 'lucide-react';
import { MetroMarket } from '../types';

interface HeroProps {
  selectedMetro: MetroMarket;
  onStartValuation: (address: string, city: string, state: string) => void;
  onOpenBuyerModal: () => void;
  onNavigateToMap: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedMetro,
  onStartValuation,
  onOpenBuyerModal,
  onNavigateToMap,
}) => {
  const [addressInput, setAddressInput] = useState('');
  const [modeTab, setModeTab] = useState<'seller' | 'investor'>('seller');

  const popularSampleAddresses: Record<string, { address: string; city: string; state: string }> = {
    dfw: { address: '4218 Fordham Rd', city: 'Dallas', state: 'TX' },
    atlanta: { address: '1042 Lucile Ave SW', city: 'Atlanta', state: 'GA' },
    tampa: { address: '614 E Henry Ave', city: 'Tampa', state: 'FL' },
    phoenix: { address: '4720 W Campbell Ave', city: 'Phoenix', state: 'AZ' },
    charlotte: { address: '812 N Chester St', city: 'Gastonia', state: 'NC' },
    houston: { address: '2214 Terry St', city: 'Houston', state: 'TX' },
    memphis: { address: '3819 Goodlett St', city: 'Memphis', state: 'TN' },
    indianapolis: { address: '734 N Tacoma Ave', city: 'Indianapolis', state: 'IN' },
  };

  const currentSample = popularSampleAddresses[selectedMetro.id] || {
    address: '1420 Oakridge Blvd',
    city: selectedMetro.name.split('-')[0],
    state: selectedMetro.state,
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
              <span>I Want To Sell (Cash Offer)</span>
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
              <span>Direct Wholesaler Cash Buyer in {selectedMetro.name}, {selectedMetro.state}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-5">
              Sell Your House As-Is In 7 Days.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700">
                Zero Fees. No Repairs. All Cash.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              Skip traditional 6% realtor commissions, months of showings, and repair demands. Get an automated property valuation and formal wholesale cash offer in 3 minutes.
            </p>

            {/* High-Converting Address Search Bar */}
            <div className="bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 max-w-2xl mx-auto mb-4 ring-4 ring-amber-500/10">
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
                    placeholder={`e.g. ${currentSample.address}, ${currentSample.city}, ${currentSample.state}`}
                    className="w-full pl-11 pr-4 py-3.5 text-sm sm:text-base font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  id="hero-get-offer-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Instant Valuation & Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Autofill Sample Address for Instant Testing */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-8">
              <span>Try sample in {selectedMetro.name}:</span>
              <button
                type="button"
                onClick={() => setAddressInput(`${currentSample.address}, ${currentSample.city}, ${currentSample.state}`)}
                className="underline hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors"
              >
                "{currentSample.address}, {currentSample.city}, {currentSample.state}"
              </button>
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
              <span>Exclusive Off-Market Wholesaling Inventory</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-5">
              Acquire Contracts at{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600">
                30% to 45% Below ARV
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              We contract direct with motivated sellers in high-velocity submarkets. Lock in equitable assignment contracts ready for immediate double-close or assignment transfer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={onNavigateToMap}
                id="hero-explore-deals-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold px-7 py-3.5 rounded-xl text-sm sm:text-base shadow-xl transition-transform hover:scale-[1.02]"
              >
                <span>Browse {selectedMetro.activeDealsCount} Live Wholesale Contracts</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBuyerModal}
                id="hero-join-buyer-vip-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
              >
                <span>Join VIP Cash Buyers List (24h Head Start)</span>
              </button>
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

        {/* Live Social Proof Ticker */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Latest Closed Deal: <strong>Arlington, TX</strong> ($185k Cash, 5-day escrow)</span>
          </div>
          <div className="hidden sm:inline text-slate-300 dark:text-slate-700">•</div>
          <div>Over <strong>$48,500,000+</strong> in distressed contracts assigned nationwide</div>
          <div className="hidden md:inline text-slate-300 dark:text-slate-700">•</div>
          <div className="hidden md:inline">Title escrow insured by <strong>Fidelity National</strong></div>
        </div>
      </div>
    </section>
  );
};
