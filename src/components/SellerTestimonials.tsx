import React from 'react';
import { Star, MessageSquareQuote, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SellerTestimonialsProps {
  onOpenSellerModal: () => void;
}

interface Testimonial {
  id: string;
  name: string;
  city: string;
  county: string;
  situation: string;
  quote: string;
  closingDays: number;
}

export const SellerTestimonials: React.FC<SellerTestimonialsProps> = ({ onOpenSellerModal }) => {
  const testimonials: Testimonial[] = [
    {
      id: 't1',
      name: 'Robert & Linda K.',
      city: 'Columbus, OH',
      county: 'Franklin County',
      situation: 'Inherited Vacant Family Home',
      quote:
        'We inherited a home in Columbus that had sat empty for nearly two years. Marcus and Crossridge were completely transparent from day one about how their investor assignment worked. We closed in 9 days with First American Title and didn’t have to clean out a single closet.',
      closingDays: 9,
    },
    {
      id: 't2',
      name: 'James T.',
      city: 'Cleveland, OH',
      county: 'Cuyahoga County',
      situation: 'Problem Rental & Deferred Plumbing',
      quote:
        'I owned a two-family rental with non-paying tenants and extensive plumbing issues. Listing on the MLS was out of the question. Crossridge explained their terms clearly with zero pressure, handled the paperwork, and gave us a clean cash exit.',
      closingDays: 11,
    },
    {
      id: 't3',
      name: 'Patricia M.',
      city: 'Cincinnati, OH',
      county: 'Hamilton County',
      situation: 'Downsizing After Spouse Passed',
      quote:
        'Realtors told me I needed $35,000 in updates and staging before they would even list. Crossridge made a fair cash offer within 24 hours and let me pick my exact moving date. The entire transaction was respectful, patient, and smooth.',
      closingDays: 8,
    },
    {
      id: 't4',
      name: 'Greg D.',
      city: 'Dayton, OH',
      county: 'Montgomery County',
      situation: 'Urgent Relocation / Job Transfer',
      quote:
        'What stood out immediately was their honesty. They were upfront that our contract would be assigned to a cash investor in their network. Everything unfolded exactly as promised, escrow was fully funded, and our proceeds wired on time.',
      closingDays: 7,
    },
    {
      id: 't5',
      name: 'Sarah & Kevin B.',
      city: 'Akron, OH',
      county: 'Summit County',
      situation: 'Older House Needing Major Roof Work',
      quote:
        'Our roof had severe storm damage and we had foundation settling that conventional buyers couldn’t get a mortgage for. Crossridge bought it 100% as-is. No renegotiating at the eleventh hour, no appraisal hurdles. Highly recommended in Ohio.',
      closingDays: 10,
    },
  ];

  // Duplicate for seamless infinite loop
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section id="testimonials-section" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            What Sellers Say
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Real experiences from Ohio property owners who chose a straightforward, transparent sale.
          </p>
        </div>
      </div>

      {/* Infinite Horizontal Sliding Marquee (Right to Left) */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right gradient edge fades for smooth visual blending */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10" />

        <div className="animate-marquee-left flex gap-6 px-4">
          {marqueeItems.map((t, idx) => (
            <div
              key={`${t.id}-${idx}`}
              className="w-[340px] sm:w-[400px] shrink-0 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all flex flex-col justify-between select-none"
            >
              <div>
                {/* Rating & Situation Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {t.closingDays}-Day Close
                  </span>
                </div>

                {/* Situation Badge */}
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{t.situation}</span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Seller Name and Location */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {t.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>{t.city} ({t.county})</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee interaction hint & CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Hover over any review to pause sliding
        </span>
        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
        <button
          onClick={onOpenSellerModal}
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
        >
          <span>Ready for your cash offer? Share your property details</span>
          <span>→</span>
        </button>
      </div>
    </section>
  );
};
