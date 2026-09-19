import React from 'react';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { WHOLESALE_LEGAL_COMPLIANCE } from '../data/wholesaleData';

export const Footer: React.FC<{ onNavigate: (section: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                CROSSRIDGE HOLDINGS <span className="text-amber-500 text-xs">LLC</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Direct principal real estate acquisitions firm operating across all 88 Ohio counties. Helping Ohio homeowners sell fast as-is for guaranteed cash, and providing qualified cash buyers with prime off-market contracts.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 pt-2">
              <a href="tel:8885822274" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                <Phone className="w-3.5 h-3.5 text-amber-500" /> (888) 582-CASH
              </a>
              <span className="text-slate-600">•</span>
              <a href="mailto:info@crossridgeholdingsllc.com" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                <Mail className="w-3.5 h-3.5 text-amber-500" /> info@crossridgeholdingsllc.com
              </a>
            </div>
          </div>

          {/* Quick Wholesale Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
              Tools & Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('about-us-section')}
                  className="hover:text-amber-400 transition-colors"
                >
                  About Us (Marcus Vance)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('property-types-section')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Ohio Property Types
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('the-process-section')}
                  className="hover:text-amber-400 transition-colors"
                >
                  The 3-Step Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('why-choose-us-section')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Why Choose Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('testimonials-section')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Seller Testimonials
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('local-seo')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Ohio City Centers & Laws
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Trust */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
              Verified Compliance
            </h4>
            <div className="space-y-2 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ORC § 4735 Statutory Disclosures</span>
              </div>
              <p className="text-slate-400">
                All earnest deposits held by neutral Ohio-authorized title insurance agencies and underwriters.
              </p>
              <div className="pt-2 text-slate-500">
                Operating statewide across all 88 Ohio counties.
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-300">Legal Disclosure:</strong> {WHOLESALE_LEGAL_COMPLIANCE.body}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 text-slate-400">
            <div>
              © {new Date().getFullYear()} Crossridge Holdings LLC. All rights reserved.
            </div>
            <div className="flex items-center gap-3">
              <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-300 cursor-pointer">Wholesaling Compliance Disclosure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
