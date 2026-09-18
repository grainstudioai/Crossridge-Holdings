import React, { useState } from 'react';
import {
  MapPin,
  DollarSign,
  TrendingUp,
  Layers,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Filter,
  FileText,
  Building,
  Maximize2,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { WholesaleProperty, MetroMarket } from '../types';

interface DynamicMapExplorerProps {
  properties: WholesaleProperty[];
  metros: MetroMarket[];
  selectedMetro: MetroMarket;
  onSelectMetro: (m: MetroMarket) => void;
  onOpenContractModal: (property: WholesaleProperty) => void;
  onOpenBuyerLeadModal: (property?: WholesaleProperty) => void;
}

export const DynamicMapExplorer: React.FC<DynamicMapExplorerProps> = ({
  properties,
  metros,
  selectedMetro,
  onSelectMetro,
  onOpenContractModal,
  onOpenBuyerLeadModal,
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || 'dfw-01');
  const [strategyFilter, setStrategyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [mapMode, setMapMode] = useState<'metro' | 'national'>('metro');

  // Filter properties
  const filteredProperties = properties.filter((prop) => {
    if (mapMode === 'metro' && prop.metroId !== selectedMetro.id) return false;
    if (strategyFilter !== 'all' && prop.strategy !== strategyFilter) return false;
    if (statusFilter !== 'all' && prop.status !== statusFilter) return false;
    return true;
  });

  const activeProperty = properties.find((p) => p.id === selectedPropertyId) || filteredProperties[0] || properties[0];

  return (
    <section id="deal-map" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>Real-Time Wholesale Inventory Map</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Off-Market Contracts & Distressed Pipeline
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Equitable interest contracts locked directly with motivated sellers. Verified title, clean assignable purchase agreements.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-medium">
            <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
              <span className="block font-black text-slate-900 dark:text-white text-base sm:text-lg">
                {properties.length}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Total Contracts</span>
            </div>
            <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
              <span className="block font-black text-amber-500 text-base sm:text-lg">
                ${(properties.reduce((acc, p) => acc + p.projectedProfit, 0) / 1000).toFixed(0)}k
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Buyer Flip Equity</span>
            </div>
            <div className="text-center px-3">
              <span className="block font-black text-emerald-500 text-base sm:text-lg">
                7 Days
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Avg Escrow</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
          {/* Metro Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <button
              onClick={() => setMapMode('national')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                mapMode === 'national'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All US Metros ({properties.length})
            </button>

            {metros.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMapMode('metro');
                  onSelectMetro(m);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  mapMode === 'metro' && selectedMetro.id === m.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {m.shortCode} ({properties.filter((p) => p.metroId === m.id).length || m.activeDealsCount})
              </button>
            ))}
          </div>

          {/* Strategy & Status Dropdowns */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={strategyFilter}
                onChange={(e) => setStrategyFilter(e.target.value)}
                className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
              >
                <option value="all">All Strategies</option>
                <option value="Fix & Flip">Fix & Flip</option>
                <option value="Rental BRRRR">Rental BRRRR</option>
                <option value="Turnkey Cashflow">Turnkey Cashflow</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
              >
                <option value="all">All Stages</option>
                <option value="Assignment Ready">Assignment Ready</option>
                <option value="Under Contract">Under Contract</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interactive Map & Property Dossier Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Dynamic Interactive Vector Map (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
            {/* Map Canvas Header */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900 dark:text-white">
                  {mapMode === 'national' ? 'Nationwide Wholesale Pipeline' : `${selectedMetro.name}, ${selectedMetro.state} Submarket Grid`}
                </span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Assignment Ready
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Under Contract
                </span>
              </div>
            </div>

            {/* Dynamic Interactive SVG Canvas */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 select-none overflow-hidden">
              {/* Radar Grid Graphic Lines */}
              <svg className="absolute inset-0 w-full h-full stroke-slate-300/40 dark:stroke-slate-800/60 stroke-[0.5]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                
                {/* Simplified US Continental Coastline Silhouette Geometry */}
                <path
                  d="M 50 30 Q 150 20, 300 25 T 550 40 Q 680 70, 720 140 T 700 280 Q 640 340, 520 370 Q 420 360, 340 390 Q 240 370, 180 340 T 80 260 Q 40 180, 50 110 Z"
                  className="fill-slate-200/50 dark:fill-slate-800/30 stroke-slate-300 dark:stroke-slate-800 stroke-1"
                />
              </svg>

              {/* Metro Region Heat Glows */}
              {metros.map((m) => (
                <div
                  key={m.id}
                  style={{ left: `${m.centerCoordinates.x}%`, top: `${m.centerCoordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <div className="w-20 h-20 rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-xl animate-pulse" />
                </div>
              ))}

              {/* Interactive Property Markers */}
              {filteredProperties.map((prop) => {
                const isSelected = prop.id === activeProperty?.id;
                const isReady = prop.status === 'Assignment Ready';
                return (
                  <div
                    key={prop.id}
                    style={{ left: `${prop.coordinates.x}%`, top: `${prop.coordinates.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                    onClick={() => setSelectedPropertyId(prop.id)}
                  >
                    {/* Ripple on active */}
                    {isSelected && (
                      <div className="absolute -inset-3 rounded-full bg-amber-500/30 dark:bg-amber-400/30 animate-ping pointer-events-none" />
                    )}

                    <div
                      className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg transition-all transform group-hover:scale-110 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-white dark:ring-slate-950 scale-110 z-20'
                          : isReady
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <MapPin className="w-3 h-3 fill-current shrink-0" />
                      <span className="whitespace-nowrap">${(prop.contractPrice / 1000).toFixed(0)}k</span>
                      <span className="text-[10px] opacity-80 font-normal">(-{prop.discountPct}%)</span>
                    </div>

                    {/* Tooltip on hover */}
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white dark:bg-slate-800 text-[11px] p-2 rounded-lg shadow-xl border border-slate-700 pointer-events-none z-30">
                      <div className="font-bold truncate">{prop.address}</div>
                      <div className="text-slate-300">{prop.city}, {prop.state}</div>
                      <div className="mt-1 flex justify-between text-amber-400 font-semibold">
                        <span>ARV: ${(prop.arv / 1000).toFixed(0)}k</span>
                        <span>Spread: +${(prop.projectedProfit / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Dynamic Legend / Controls overlay */}
              <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] shadow-sm">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {mapMode === 'metro' ? `${selectedMetro.name} Hub` : 'US Nationwide'}
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Showing {filteredProperties.length} active wholesale contracts
                </div>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-1">
                <button
                  onClick={() => setMapMode(mapMode === 'metro' ? 'national' : 'metro')}
                  className="px-2.5 py-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-white dark:hover:bg-slate-800 flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>{mapMode === 'metro' ? 'Zoom Out US' : 'Zoom In Metro'}</span>
                </button>
              </div>
            </div>

            {/* Quick Property Strip */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {filteredProperties.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPropertyId(p.id)}
                  className={`px-3 py-2 rounded-xl text-left text-xs shrink-0 transition-all border ${
                    p.id === activeProperty?.id
                      ? 'bg-white dark:bg-slate-800 border-amber-500 shadow-sm ring-1 ring-amber-500'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                    {p.address}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2 mt-0.5">
                    <span>${(p.contractPrice / 1000).toFixed(0)}k</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+{p.discountPct}% off</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Rich Deal Breakdown & Underwriting Dossier (5 cols) */}
          {activeProperty && (
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              {/* Property Image & Badge */}
              <div className="relative rounded-xl overflow-hidden mb-4 aspect-[16/10] bg-slate-100 dark:bg-slate-800">
                <img
                  src={activeProperty.imageUrl}
                  alt={activeProperty.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                    activeProperty.status === 'Assignment Ready'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {activeProperty.status}
                  </span>
                  <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-sm">
                    {activeProperty.strategy}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeProperty.closingDeadline}</span>
                </div>
              </div>

              {/* Title & Address */}
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                  {activeProperty.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{activeProperty.address}, {activeProperty.city}, {activeProperty.state} {activeProperty.zip}</span>
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium mt-2">
                  <span>{activeProperty.bedrooms} Beds</span>
                  <span>•</span>
                  <span>{activeProperty.bathrooms} Baths</span>
                  <span>•</span>
                  <span>{activeProperty.sqft.toLocaleString()} SqFt</span>
                  <span>•</span>
                  <span>Built {activeProperty.yearBuilt}</span>
                </div>
              </div>

              {/* Wholesale Economics Table */}
              <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700/80 mb-4 text-xs">
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2">
                  Wholesale Underwriting Breakdown
                </div>
                
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Buyer Purchase Price</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      ${activeProperty.contractPrice.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">After Repair Value (ARV)</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ${activeProperty.arv.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Est. Rehab</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      ${activeProperty.estimatedRepairs.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Assignment Fee</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      ${activeProperty.assignmentFee.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Projected Profit</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      +${activeProperty.projectedProfit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Motivation Context & Comps */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                  <Info className="w-3.5 h-3.5 text-amber-500" />
                  <span>Seller Situation / Deal Note:</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-amber-500/5 dark:bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                  "{activeProperty.sellerMotivation}"
                </p>
              </div>

              {/* Comps Snapshot */}
              <div className="mb-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
                  Verified Neighborhood Sold Comps
                </span>
                <div className="space-y-1 text-xs">
                  {activeProperty.comps.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      <span className="truncate max-w-[180px] font-medium">{c.address}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-slate-900 dark:text-white">${c.salePrice.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400">({c.distance})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* High-Converting Action CTAs */}
              <div className="space-y-2">
                <button
                  onClick={() => onOpenBuyerLeadModal(activeProperty)}
                  id="lock-deal-contract-btn"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01]"
                >
                  <DollarSign className="w-4 h-4 fill-current" />
                  <span>Lock In Contract ($2,500 Earnest Deposit)</span>
                </button>

                <button
                  onClick={() => onOpenContractModal(activeProperty)}
                  id="preview-assignment-agreement-btn"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>View Standard Assignment Agreement Draft</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
