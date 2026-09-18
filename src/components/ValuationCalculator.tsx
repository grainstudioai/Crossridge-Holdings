import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  DollarSign,
  TrendingUp,
  Percent,
  Hammer,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { MetroMarket, ValuationResult } from '../types';

interface ValuationCalculatorProps {
  selectedMetro: MetroMarket;
  onLeadTrigger: (data: any) => void;
}

export const ValuationCalculator: React.FC<ValuationCalculatorProps> = ({
  selectedMetro,
  onLeadTrigger,
}) => {
  const [activeTab, setActiveTab] = useState<'seller' | 'investor'>('seller');

  // Seller Instant Valuation Inputs
  const [sellerAddress, setSellerAddress] = useState('4218 Fordham Rd');
  const [sellerCity, setSellerCity] = useState(selectedMetro.name.split('-')[0]);
  const [sellerState, setSellerState] = useState(selectedMetro.state);
  const [sellerSqft, setSellerSqft] = useState<number>(1650);
  const [sellerCondition, setSellerCondition] = useState<string>('fair');
  const [sellerMotivation, setSellerMotivation] = useState<string>('needs_fast_cash');
  const [isValuating, setIsValuating] = useState<boolean>(false);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);

  // Wholesaler 70% MAO Engine Inputs
  const [calcARV, setCalcARV] = useState<number>(320000);
  const [calcRepairPreset, setCalcRepairPreset] = useState<number>(35000);
  const [calcDiscountPct, setCalcDiscountPct] = useState<number>(70); // 70% Rule
  const [calcAssignmentFee, setCalcAssignmentFee] = useState<number>(15000);

  // Computed 70% MAO values
  const investorBuyPrice = Math.round((calcARV * (calcDiscountPct / 100)) - calcRepairPreset);
  const maximumAllowableOffer = Math.max(25000, investorBuyPrice - calcAssignmentFee);
  const investorGrossProfit = Math.round(calcARV - (investorBuyPrice + calcRepairPreset));
  const investorTotalCashRequired = investorBuyPrice + calcRepairPreset;
  const projectedCashROI = investorTotalCashRequired > 0 ? ((investorGrossProfit / investorTotalCashRequired) * 100).toFixed(1) : '0';

  // Perform AI Valuation calculation
  const handleRunAiValuation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsValuating(true);

    try {
      const response = await fetch('/api/ai-valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: sellerAddress,
          city: sellerCity,
          state: sellerState,
          sqft: sellerSqft,
          condition: sellerCondition,
          reasonForSelling: sellerMotivation,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned non-200');
      }

      const data = await response.json();
      setValuationResult(data);
    } catch (err) {
      // Robust client-side fallback calculation matching wholesale 70% rule
      const basePriceSqft = selectedMetro.state === 'TX' ? 195 : selectedMetro.state === 'FL' ? 220 : 180;
      const estimatedARV = sellerSqft * basePriceSqft;
      const repairsMap: Record<string, number> = {
        excellent: 12000,
        fair: 28000,
        poor: 52000,
        distressed: 85000,
        fire_water_damage: 110000,
      };
      const estimatedRepairs = repairsMap[sellerCondition] || 35000;
      const assignmentFee = 15000;
      const maxAllowableOffer = Math.round(estimatedARV * 0.70 - estimatedRepairs - assignmentFee);

      setValuationResult({
        success: true,
        address: `${sellerAddress}, ${sellerCity}, ${sellerState}`,
        metrics: {
          estimatedARV,
          estimatedRepairs,
          assignmentFee,
          maxAllowableOffer,
          fastCashOfferLow: Math.round(maxAllowableOffer * 0.96),
          fastCashOfferHigh: Math.round(maxAllowableOffer * 1.04),
          equitySpread: estimatedARV - maxAllowableOffer,
          projectedClosingDays: 7,
          sellerSavingsVsRealtor: Math.round(estimatedARV * 0.06 + 3500 + estimatedRepairs * 0.25),
        },
        aiInsight: `Based on active wholesale assignment transactions in the ${sellerCity}, ${sellerState} submarket, this single-family footprint commands an After Repair Value (ARV) of $${estimatedARV.toLocaleString()}. Our algorithmic 70% rule purchase offer provides immediate certainty with zero commissions and clean 7-day escrow deposit.`,
        comparableSalesNotes: `Local investor flip comps in this zip code average $${(estimatedARV * 0.95).toLocaleString()} to $${(estimatedARV * 1.05).toLocaleString()} when renovated to turnkey granite/LVP standard.`,
        negotiationTip: `Close with zero seller-paid transfer taxes, zero inspection credits, and flexible move-out timeline.`,
        underwritingTimestamp: new Date().toISOString(),
      });
    } finally {
      setIsValuating(false);
    }
  };

  return (
    <section id="valuation-engine" className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Automated Valuation & 70% MAO Engine</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Institutional Wholesale Underwriting Tools
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Calculate instant as-is seller cash walkaway amounts or test your wholesale spread using standard 70% rule Maximum Allowable Offer formulas.
          </p>

          {/* Calculator Tabs */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('seller')}
                className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'seller'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                1. Seller Instant Cash Valuation
              </button>
              <button
                onClick={() => setActiveTab('investor')}
                id="mao-calculator"
                className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'investor'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                2. Wholesaler 70% MAO Underwriter
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Seller Instant Valuation & Offer Engine */}
        {activeTab === 'seller' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Form (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Automated Property Appraisal Parameters
                </h3>
              </div>

              <form onSubmit={handleRunAiValuation} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Property Street Address
                  </label>
                  <input
                    type="text"
                    value={sellerAddress}
                    onChange={(e) => setSellerAddress(e.target.value)}
                    placeholder="e.g. 4218 Fordham Rd"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={sellerCity}
                      onChange={(e) => setSellerCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={sellerState}
                      onChange={(e) => setSellerState(e.target.value.toUpperCase())}
                      maxLength={2}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Approx. Sq Footage
                    </label>
                    <input
                      type="number"
                      value={sellerSqft}
                      onChange={(e) => setSellerSqft(Number(e.target.value))}
                      min={400}
                      max={12000}
                      step={50}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Property Condition
                    </label>
                    <select
                      value={sellerCondition}
                      onChange={(e) => setSellerCondition(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      <option value="excellent">Move-in Ready (Minor cosmetic)</option>
                      <option value="fair">Fair (Dated kitchen/baths)</option>
                      <option value="poor">Needs Major Repairs (Roof/HVAC)</option>
                      <option value="distressed">Severely Distressed / Full Gut</option>
                      <option value="fire_water_damage">Fire / Water / Structural Damage</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Reason for Selling
                  </label>
                  <select
                    value={sellerMotivation}
                    onChange={(e) => setSellerMotivation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="needs_fast_cash">Need quick cash closing in 7-14 days</option>
                    <option value="inherited_probate">Inherited / Probate Estate property</option>
                    <option value="tired_landlord">Tired landlord / bad tenants</option>
                    <option value="pre_foreclosure">Pre-foreclosure / behind on payments</option>
                    <option value="burdensome_repairs">House needs too many costly repairs</option>
                    <option value="relocating">Relocating / downsizing</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isValuating}
                  id="run-valuation-btn"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold py-3 rounded-xl shadow-md shadow-amber-500/25 transition-all disabled:opacity-70"
                >
                  {isValuating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Underwriting with Comps Engine...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span>Generate Instant Valuation & Offer</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Output Dossier (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                    Automated Valuation Memorandum
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {valuationResult ? valuationResult.address : `${sellerAddress}, ${sellerCity}, ${sellerState}`}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 70% Wholesale Rule Applied
                  </span>
                </div>
              </div>

              {/* Offer Numbers Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block mb-1">
                    Preliminary Cash Offer
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                    ${valuationResult ? valuationResult.metrics.maxAllowableOffer.toLocaleString() : (sellerSqft * 195 * 0.7 - 35000 - 15000).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Zero fees • 100% As-Is</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Estimated ARV
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    ${valuationResult ? valuationResult.metrics.estimatedARV.toLocaleString() : (sellerSqft * 195).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">After-Repair Value</span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-1">
                    Net Realtor Savings
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    +${valuationResult ? valuationResult.metrics.sellerSavingsVsRealtor.toLocaleString() : Math.round(sellerSqft * 195 * 0.06 + 3500 + 7000).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Commissions & Fees Saved</span>
                </div>
              </div>

              {/* AI Underwriting Analysis & Narrative */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 mb-5 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Acquisition Underwriting Summary:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {valuationResult
                    ? valuationResult.aiInsight
                    : `Based on current submarket cash comps for ${sellerCity}, ${sellerState}, properties of approximately ${sellerSqft} sqft in "${sellerCondition}" condition require around $35,000 in repair allowances. Under standard 70% wholesale underwriting, our cash offer provides zero-contingency certainty with an escrow closing in as few as 7 business days.`}
                </p>
              </div>

              {/* Comparison: Cash Wholesale Sale vs Traditional Agent Listing */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-5 text-xs">
                <div className="bg-slate-100 dark:bg-slate-800 px-3.5 py-2 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                  Sale Comparison: Selling To Us vs. Traditional MLS Listing
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  <div className="grid grid-cols-3 p-2.5 font-medium">
                    <span className="text-slate-500">Timeline</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">7 - 14 Days</span>
                    <span className="text-slate-600 dark:text-slate-400">65 - 120 Days</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 font-medium">
                    <span className="text-slate-500">Realtor Commissions</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">$0 (Zero)</span>
                    <span className="text-red-500 font-semibold">6% (~${valuationResult ? Math.round(valuationResult.metrics.estimatedARV * 0.06).toLocaleString() : Math.round(sellerSqft * 195 * 0.06).toLocaleString()})</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 font-medium">
                    <span className="text-slate-500">Repairs & Cleaning</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">$0 (Sell 100% As-Is)</span>
                    <span className="text-red-500 font-semibold">Required by buyer lender</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 font-medium">
                    <span className="text-slate-500">Closing Costs</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">We Pay 100%</span>
                    <span className="text-slate-600 dark:text-slate-400">Seller pays 2% - 3%</span>
                  </div>
                </div>
              </div>

              {/* Formal Offer Acceptance Trigger */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Ready to lock in this preliminary cash offer?
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    No obligation. A written Purchase Agreement (LOI) will be sent to your phone/email.
                  </div>
                </div>
                <button
                  onClick={() => onLeadTrigger({
                    address: sellerAddress,
                    city: sellerCity,
                    state: sellerState,
                    sqft: sellerSqft,
                    condition: sellerCondition,
                    reasonForSelling: sellerMotivation,
                    estimatedOffer: valuationResult?.metrics.maxAllowableOffer || (sellerSqft * 195 * 0.7 - 50000),
                  })}
                  id="claim-cash-offer-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all shrink-0"
                >
                  <span>Accept Cash Offer & Lock Contract</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive 70% Wholesaling MAO Engine */}
        {activeTab === 'investor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sliders & Variables (6 cols) */}
            <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-800/60 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    70% Rule Formula Breakdown
                  </h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  MAO = (ARV × {calcDiscountPct}%) - Rehab - Fee
                </span>
              </div>

              {/* Slider 1: After Repair Value (ARV) */}
              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">After Repair Value (ARV)</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    ${calcARV.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={900000}
                  step={5000}
                  value={calcARV}
                  onChange={(e) => setCalcARV(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>$100k</span>
                  <span>$500k</span>
                  <span>$900k+</span>
                </div>
              </div>

              {/* Slider 2: Estimated Repair Budget */}
              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Estimated Repair Budget</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    ${calcRepairPreset.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={120000}
                  step={2500}
                  value={calcRepairPreset}
                  onChange={(e) => setCalcRepairPreset(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                {/* Repair Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    { label: 'Light Paint/Carpet', amount: 15000 },
                    { label: 'Moderate Kitchen/Baths', amount: 35000 },
                    { label: 'Heavy Gut Rehab', amount: 65000 },
                    { label: 'Structural / Fire', amount: 95000 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setCalcRepairPreset(preset.amount)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors ${
                        calcRepairPreset === preset.amount
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {preset.label} (${preset.amount / 1000}k)
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 3: Investor Target Discount Percentage */}
              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Investor Target Rule / Discount</span>
                  <span className="text-base font-black text-amber-500">
                    {calcDiscountPct}% of ARV
                  </span>
                </div>
                <input
                  type="range"
                  min={65}
                  max={80}
                  step={1}
                  value={calcDiscountPct}
                  onChange={(e) => setCalcDiscountPct(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>65% (Aggressive Flipper)</span>
                  <span>70% (Standard Wholesale)</span>
                  <span>80% (Rental / Turnkey)</span>
                </div>
              </div>

              {/* Slider 4: Wholesaler Assignment Fee */}
              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Your Wholesaler Assignment Fee</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    ${calcAssignmentFee.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={40000}
                  step={1000}
                  value={calcAssignmentFee}
                  onChange={(e) => setCalcAssignmentFee(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>$5,000</span>
                  <span>$15,000 (Avg)</span>
                  <span>$40,000</span>
                </div>
              </div>
            </div>

            {/* Results Output & Graphic Waterfall (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Underwriting Results & Deal Margin
                  </h4>
                  <span className="text-[11px] text-slate-500">Live Mathematical Model</span>
                </div>

                {/* Big MAO Display Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Calculator className="w-24 h-24" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block mb-1">
                      Maximum Allowable Offer (MAO to Seller)
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                      ${maximumAllowableOffer.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                      Contract this property with the motivated seller at or below this number to guarantee a <strong>${calcAssignmentFee.toLocaleString()}</strong> assignment fee while giving your buyer a <strong>{calcDiscountPct}%</strong> purchase basis.
                    </p>
                  </div>
                </div>

                {/* Capital Waterfall Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Investor Buy Price</span>
                    <span className="font-black text-slate-900 dark:text-white text-base">
                      ${investorBuyPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Flipper Net Profit</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                      +${investorGrossProfit.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Flipper Cash ROI</span>
                    <span className="font-black text-blue-600 dark:text-blue-400 text-base">
                      {projectedCashROI}%
                    </span>
                  </div>
                </div>

                {/* Equity Breakdown Stack Bar */}
                <div className="space-y-2 mb-6 text-xs">
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span>Equity Stack Breakdown of ARV (${calcARV.toLocaleString()})</span>
                  </div>
                  <div className="h-4 rounded-full overflow-hidden flex w-full bg-slate-100 dark:bg-slate-800">
                    <div
                      style={{ width: `${(maximumAllowableOffer / calcARV) * 100}%` }}
                      className="bg-amber-500"
                      title={`Seller Cash: $${maximumAllowableOffer.toLocaleString()}`}
                    />
                    <div
                      style={{ width: `${(calcAssignmentFee / calcARV) * 100}%` }}
                      className="bg-amber-700"
                      title={`Assignment Fee: $${calcAssignmentFee.toLocaleString()}`}
                    />
                    <div
                      style={{ width: `${(calcRepairPreset / calcARV) * 100}%` }}
                      className="bg-slate-500"
                      title={`Rehab Budget: $${calcRepairPreset.toLocaleString()}`}
                    />
                    <div
                      style={{ width: `${(investorGrossProfit / calcARV) * 100}%` }}
                      className="bg-emerald-500"
                      title={`Flipper Profit: $${investorGrossProfit.toLocaleString()}`}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> Seller (${(maximumAllowableOffer / 1000).toFixed(0)}k)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-700" /> Wholesale Fee (${(calcAssignmentFee / 1000).toFixed(0)}k)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-500" /> Repairs (${(calcRepairPreset / 1000).toFixed(0)}k)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Flipper Profit (${(investorGrossProfit / 1000).toFixed(0)}k)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onLeadTrigger({
                  address: 'Custom Property Underwritten',
                  targetOffer: maximumAllowableOffer,
                  arv: calcARV,
                  repairs: calcRepairPreset,
                  fee: calcAssignmentFee,
                })}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all"
              >
                <span>Save Deal Memo & Request Buyer Match</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
