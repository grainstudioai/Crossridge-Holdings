import React from 'react';
import { Phone, Building2, MapPin, Moon, Sun, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';
import { MetroMarket } from '../types';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  selectedMetro: MetroMarket;
  onSelectMetro: (metro: MetroMarket) => void;
  allMetros: MetroMarket[];
  onOpenSellerModal: () => void;
  onOpenBuyerModal: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  selectedMetro,
  onSelectMetro,
  allMetros,
  onOpenSellerModal,
  onOpenBuyerModal,
  onNavigate,
}) => {
  const [metroDropdownOpen, setMetroDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Top Local SEO / Motivated Seller Urgency Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-slate-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded text-[11px] border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE CASH DEPOSITS ACTIVE
            </span>
            <span className="hidden sm:inline text-slate-300">
              Active title escrow in <strong className="text-white">{selectedMetro.name}, {selectedMetro.state}</strong> • 7-day guaranteed closing
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden md:inline-flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              BBB A+ Accredited Wholesale Principal
            </span>
            <a
              href="tel:8885822274"
              id="header-phone-hotline"
              className="inline-flex items-center gap-1.5 font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>(888) 582-CASH</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                US EQUITRADE<span className="text-amber-500 font-extrabold text-sm px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">WHOLESALE</span>
              </span>
              <p className="text-[10px] tracking-wide text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Direct-to-Contract Realty Network
              </p>
            </div>
          </button>

          {/* Dynamic Metro Selector */}
          <div className="relative hidden lg:block ml-2">
            <button
              onClick={() => setMetroDropdownOpen(!metroDropdownOpen)}
              id="metro-selector-dropdown-btn"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Market: <strong>{selectedMetro.name}</strong></span>
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                {selectedMetro.activeDealsCount} Deals
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {metroDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setMetroDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700/60 mb-1">
                  Select US Wholesale Hub
                </div>
                {allMetros.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectMetro(m);
                      setMetroDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-500/10 dark:hover:bg-amber-500/15 transition-colors ${
                      m.id === selectedMetro.id
                        ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-500/5'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{m.name}, {m.state}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Avg {m.avgDiscountPct}% below ARV</div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-medium">
                      {m.activeDealsCount}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('valuation-engine')}
            className="px-3 py-2 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Instant Valuation
          </button>
          <button
            onClick={() => onNavigate('deal-map')}
            className="px-3 py-2 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            Deals Map
          </button>
          <button
            onClick={() => onNavigate('mao-calculator')}
            className="px-3 py-2 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            70% MAO Calculator
          </button>
          <button
            onClick={() => onNavigate('local-seo')}
            className="px-3 py-2 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Markets & Laws
          </button>
          <button
            onClick={onOpenBuyerModal}
            className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-amber-500 font-semibold transition-colors"
          >
            Cash Buyers VIP
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            id="theme-toggle-btn"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Primary Seller Conversion Button */}
          <button
            onClick={onOpenSellerModal}
            id="nav-get-cash-offer-btn"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Get Cash Offer</span>
          </button>
        </div>
      </div>
    </header>
  );
};
