import React from 'react';
import { Phone, Building2, Moon, Sun, ShieldCheck, Sparkles } from 'lucide-react';
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
  onOpenSellerModal,
  onOpenBuyerModal,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-slate-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 font-semibold px-2 py-0.5 rounded text-[10px] border border-amber-500/30">
              OHIO REAL ESTATE ACQUISITIONS
            </span>
            <span className="hidden sm:inline">Direct principal cash home buyers across all 88 Ohio counties</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden md:inline-flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              BBB Accredited Principal Buyer
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
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                CROSSRIDGE HOLDINGS <span className="text-amber-500 font-extrabold text-xs px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">LLC</span>
              </span>
              <p className="text-[10px] tracking-wide text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Ohio Direct Cash Home Buyers
              </p>
            </div>
          </button>
        </div>

        {/* Section Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('about-us-section')}
            className="px-2.5 py-2 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            About Us
          </button>
          <button
            onClick={() => onNavigate('property-types-section')}
            className="px-2.5 py-2 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Property Types
          </button>
          <button
            onClick={() => onNavigate('the-process-section')}
            className="px-2.5 py-2 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            The Process
          </button>
          <button
            onClick={() => onNavigate('why-choose-us-section')}
            className="px-2.5 py-2 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Why Choose Us
          </button>
          <button
            onClick={() => onNavigate('testimonials-section')}
            className="px-2.5 py-2 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Testimonials
          </button>
          <button
            onClick={() => onNavigate('local-seo')}
            className="px-2.5 py-2 rounded-lg hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Ohio Markets
          </button>
          <button
            onClick={onOpenBuyerModal}
            className="px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-amber-500 font-semibold transition-colors"
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
