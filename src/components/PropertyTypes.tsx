import React from 'react';
import { Home, Hammer, Building, Key, Users, Sparkles, ArrowRight } from 'lucide-react';

interface PropertyTypesProps {
  onOpenSellerModal: () => void;
}

interface PropertyCategory {
  id: string;
  title: string;
  description: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
}

export const PropertyTypes: React.FC<PropertyTypesProps> = ({ onOpenSellerModal }) => {
  const propertyCategories: PropertyCategory[] = [
    {
      id: 'major-repairs',
      title: 'Needs Major Repairs',
      description:
        'Distressed or long-neglected properties are still worth a conversation — some investors specifically look for this kind of project.',
      tag: 'Distressed / Heavy Rehab',
      icon: Hammer,
      image:
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'vacant',
      title: 'Vacant Properties',
      description:
        'If a property has been sitting empty, tell us about its condition and situation.',
      tag: 'Unoccupied / Zero Income',
      icon: Key,
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'inherited',
      title: 'Inherited Properties',
      description:
        'Selling an inherited property can involve decisions about repairs, cleanout, timing, and next steps.',
      tag: 'Estate & Probate',
      icon: Users,
      image:
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'rental',
      title: 'Rental Properties',
      description:
        "If you're considering selling a rental property, tell us about it and its current situation.",
      tag: 'Tenant-Occupied / Portfolios',
      icon: Building,
      image:
        'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'partially-renovated',
      title: 'Older or Partially Renovated',
      description:
        'Properties with some deferred maintenance or a partial update can still be a good fit, even without a full renovation.',
      tag: 'Deferred Maintenance',
      icon: Home,
      image:
        'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'move-in-ready',
      title: 'Move-In Ready',
      description:
        'Not every property we review needs work — other investors specifically look for properties that are already updated.',
      tag: 'Turnkey & Updated',
      icon: Sparkles,
      image:
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section id="property-types-section" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <Home className="w-3.5 h-3.5" />
            <span>Property Types</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Ohio Properties in a Range of Conditions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Different investors in our network look for different things — from properties needing significant work to those that are already move-in ready. Tell us about yours and we'll review the fit.
          </p>
        </div>

        {/* 6 Property Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {propertyCategories.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={onOpenSellerModal}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-400/60 dark:hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Photo container */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-amber-400 border border-slate-700/60 shadow-sm">
                      <Icon className="w-3 h-3" />
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                    <span>Review Fit for This Property</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner CTA */}
        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3">
            Have a unique situation or an unconventional property in Ohio?
          </p>
          <button
            onClick={onOpenSellerModal}
            id="property-types-cta-btn"
            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-amber-600 hover:text-slate-950 dark:hover:bg-amber-500 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors shadow-md"
          >
            <span>Tell Us About Your Property</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
