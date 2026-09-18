import React from 'react';
import { Phone, Mail, MapPin, Building2, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutUsProps {
  onOpenSellerModal: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onOpenSellerModal }) => {
  return (
    <section id="about-us-section" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>About Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            A Straightforward Home-Buying Company
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Direct, respectful property solutions for Ohio homeowners seeking certainty and speed without the hassle of traditional listings.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Founder Picture & Credentials Card */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative w-full max-w-md mx-auto lg:max-w-none">
              {/* Outer decorative glow / frame */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-amber-600/10 rounded-3xl blur-lg -z-10" />
              
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80"
                  alt="Marcus Vance - Founder, Crossridge Holdings LLC"
                  className="w-full h-80 sm:h-96 object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                    Leadership
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Marcus Vance
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    Founder, Crossridge Holdings LLC
                  </p>
                </div>
              </div>

              {/* Trust badges below photo */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Ohio Principal</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Direct Contract Buyer</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">All 88 Counties</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Statewide Acquisitions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story & Company Profile */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-block text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                Our Story & Commitment
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug">
                Built on Integrity, Transparency, and Straightforward Solutions.
              </h3>
            </div>

            {/* Story copy */}
            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Crossridge Holdings LLC was founded with a simple idea: selling a property should not have to be complicated.
              </p>
              <p>
                We provide property owners with a straightforward alternative to the traditional home selling process. Whether a property needs significant repairs, has been sitting vacant, was recently inherited, or has become difficult to manage, we take the time to understand the situation and provide a clear path forward.
              </p>
              <p>
                Our approach is simple. We evaluate each property honestly, communicate clearly, and work to make the selling process as smooth as possible. There are no unnecessary preparations or pressure to make a property something it isn't.
              </p>
              <p>
                We also work with licensed title professionals to help ensure each transaction is handled properly from start to finish.
              </p>
              <p className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border-l-4 border-amber-500 text-slate-900 dark:text-slate-100 font-bold">
                Our goal is simple: provide property owners with a transparent, practical way to move forward when selling a property the traditional way isn't the right fit.
              </p>
            </div>

            {/* Contact Details Card */}
            <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Company & Contact Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Company Name</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    Crossridge Holdings LLC
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Headquarters Location</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    Columbus, Ohio (Franklin County)
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Direct Telephone</span>
                  <a
                    href="tel:8885822274"
                    className="font-bold text-slate-900 dark:text-white hover:text-amber-500 flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-500" />
                    (888) 582-2274 / (614) 896-2274
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Official Email</span>
                  <a
                    href="mailto:acquisitions@crossridgeholdings.com"
                    className="font-bold text-slate-900 dark:text-white hover:text-amber-500 flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-amber-500" />
                    acquisitions@crossridgeholdings.com
                  </a>
                </div>
              </div>

              {/* Call to action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={onOpenSellerModal}
                  id="about-us-get-offer-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>Connect With Our Team</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Direct conversation • Zero pressure • No obligation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
