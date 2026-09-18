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
                US EQUITRADE WHOLESALE
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Empowering motivated US property owners to sell as-is for guaranteed cash in 7 days, and providing cash flippers and buy-and-hold investors with exclusive off-market contract assignments.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 pt-2">
              <a href="tel:8885822274" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                <Phone className="w-3.5 h-3.5 text-amber-500" /> (888) 582-CASH
              </a>
              <span className="text-slate-600">•</span>
              <a href="mailto:acquisitions@us-equitrade-realty.com" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                <Mail className="w-3.5 h-3.5 text-amber-500" /> acquisitions@us-equitrade-realty.com
              </a>
            </div>
          </div>

          {/* Quick Wholesale Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
              Tools & Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('hero')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Instant Cash Valuation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('deal-map')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Interactive Deal Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('valuation-engine')}
                  className="hover:text-amber-400 transition-colors"
                >
                  70% Rule MAO Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('local-seo')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Metro SEO Hub & Statutes
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
                <span>Equitable Interest Disclosures</span>
              </div>
              <p className="text-slate-400">
                All earnest deposits held by neutral state-authorized title insurance underwriters.
              </p>
              <div className="pt-2 text-slate-500">
                Operating in TX, GA, FL, AZ, NC, TN, OH, PA, IN.
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
              © {new Date().getFullYear()} US Equitrade Wholesale Network. All rights reserved.
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
