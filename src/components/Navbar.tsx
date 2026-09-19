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
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                CROSSRIDGE HOLDINGS
              </span>
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
            <span>Get Your Cash Offer</span>
          </button>
        </div>
      </div>
    </header>
  );
};
