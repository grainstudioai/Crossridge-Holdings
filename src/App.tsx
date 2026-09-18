import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DynamicMapExplorer } from './components/DynamicMapExplorer';
import { ValuationCalculator } from './components/ValuationCalculator';
import { LocalSeoDominance } from './components/LocalSeoDominance';
import { CaseStudies } from './components/CaseStudies';
import { Footer } from './components/Footer';
import { SellerLeadModal } from './components/SellerLeadModal';
import { CashBuyerModal } from './components/CashBuyerModal';
import { ContractModal } from './components/ContractModal';
import { METRO_MARKETS, WHOLESALE_PROPERTIES } from './data/wholesaleData';
import { MetroMarket, WholesaleProperty, SellerLead } from './types';
import { Phone, Sparkles, MapPin, Calculator, ShieldCheck } from 'lucide-react';

export default function App() {
  // Dark mode state: default to dark for high-tech premium feel, with persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('us_wholesale_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const [selectedMetro, setSelectedMetro] = useState<MetroMarket>(METRO_MARKETS[0]); // Dallas-Fort Worth default
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Modals state
  const [isSellerModalOpen, setIsSellerModalOpen] = useState<boolean>(false);
  const [sellerModalData, setSellerModalData] = useState<Partial<SellerLead> & { estimatedOffer?: number }>({});

  const [isBuyerModalOpen, setIsBuyerModalOpen] = useState<boolean>(false);
  const [buyerModalProperty, setBuyerModalProperty] = useState<WholesaleProperty | undefined>(undefined);

  const [isContractModalOpen, setIsContractModalOpen] = useState<boolean>(false);
  const [contractProperty, setContractProperty] = useState<WholesaleProperty | null>(null);

  // Sync dark mode class with HTML document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('us_wholesale_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('us_wholesale_theme', 'light');
    }
  }, [darkMode]);

  // Smooth navigation handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trigger valuation flow from hero search
  const handleStartValuationFromHero = (address: string, city: string, state: string) => {
    setSellerModalData({
      address,
      city,
      state,
      zip: selectedMetro.popularZipCodes[0] || '75216',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1650,
      condition: 'fair',
    });
    setIsSellerModalOpen(true);
  };

  // Open seller modal with custom city
  const handleOpenSellerWithCity = (city: string, state: string) => {
    setSellerModalData({
      city,
      state,
      address: '',
    });
    setIsSellerModalOpen(true);
  };

  // Trigger from calculator lead acceptance
  const handleCalculatorLeadTrigger = (calcData: any) => {
    setSellerModalData({
      address: calcData.address || 'Evaluated Property',
      city: calcData.city || selectedMetro.name.split('-')[0],
      state: calcData.state || selectedMetro.state,
      sqft: calcData.sqft || 1650,
      condition: calcData.condition || 'fair',
      estimatedOffer: calcData.estimatedOffer || calcData.targetOffer,
    });
    setIsSellerModalOpen(true);
  };

  // Trigger buyer lock on specific property
  const handleOpenBuyerForProperty = (property?: WholesaleProperty) => {
    setBuyerModalProperty(property);
    setIsBuyerModalOpen(true);
  };

  // Trigger assignment contract draft preview
  const handleOpenContractDraft = (property: WholesaleProperty) => {
    setContractProperty(property);
    setIsContractModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-amber-500/20 selection:text-amber-500">
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        selectedMetro={selectedMetro}
        onSelectMetro={setSelectedMetro}
        allMetros={METRO_MARKETS}
        onOpenSellerModal={() => {
          setSellerModalData({});
          setIsSellerModalOpen(true);
        }}
        onOpenBuyerModal={() => handleOpenBuyerForProperty(undefined)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          selectedMetro={selectedMetro}
          onStartValuation={handleStartValuationFromHero}
          onOpenBuyerModal={() => handleOpenBuyerForProperty(undefined)}
          onNavigateToMap={() => handleNavigate('deal-map')}
        />

        {/* Dynamic Deals Map Explorer */}
        <DynamicMapExplorer
          properties={WHOLESALE_PROPERTIES}
          metros={METRO_MARKETS}
          selectedMetro={selectedMetro}
          onSelectMetro={setSelectedMetro}
          onOpenContractModal={handleOpenContractDraft}
          onOpenBuyerLeadModal={handleOpenBuyerForProperty}
        />

        {/* Automated Valuation & 70% MAO Engine */}
        <ValuationCalculator
          selectedMetro={selectedMetro}
          onLeadTrigger={handleCalculatorLeadTrigger}
        />

        {/* Local SEO Dominance Hub */}
        <LocalSeoDominance
          metros={METRO_MARKETS}
          selectedMetro={selectedMetro}
          onSelectMetro={setSelectedMetro}
          onOpenSellerModal={handleOpenSellerWithCity}
        />

        {/* Proven Closings & Case Studies */}
        <CaseStudies
          onOpenSellerModal={() => {
            setSellerModalData({});
            setIsSellerModalOpen(true);
          }}
        />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Mobile Conversion Bar (Optimized for Mobile Retention) */}
      <div className="fixed bottom-0 inset-x-0 z-30 p-2 sm:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-2xl">
        <a
          href="tel:8885822274"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
        >
          <Phone className="w-3.5 h-3.5 text-amber-500 fill-current" />
          <span>Call 24/7 Hotline</span>
        </a>

        <button
          onClick={() => {
            setSellerModalData({});
            setIsSellerModalOpen(true);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 shadow-md shadow-amber-500/20"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>Get Cash Offer</span>
        </button>
      </div>

      {/* Modals */}
      <SellerLeadModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        initialData={sellerModalData}
      />

      <CashBuyerModal
        isOpen={isBuyerModalOpen}
        onClose={() => setIsBuyerModalOpen(false)}
        targetProperty={buyerModalProperty}
        metros={METRO_MARKETS}
      />

      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        property={contractProperty}
      />
    </div>
  );
}
