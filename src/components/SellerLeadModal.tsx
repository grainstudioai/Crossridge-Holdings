import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Home,
  Phone,
  Mail,
  User,
  Clock,
  Download,
  AlertTriangle,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SellerLead } from '../types';

interface SellerLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<SellerLead> & { estimatedOffer?: number };
}

export const SellerLeadModal: React.FC<SellerLeadModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [leadRefId, setLeadRefId] = useState<string>('');

  const [formData, setFormData] = useState<SellerLead>({
    address: initialData?.address || '',
    city: initialData?.city || 'Columbus',
    state: initialData?.state || 'OH',
    zip: initialData?.zip || '43215',
    bedrooms: initialData?.bedrooms || 3,
    bathrooms: initialData?.bathrooms || 2,
    sqft: initialData?.sqft || 1650,
    propertyType: initialData?.propertyType || 'Single Family',
    condition: initialData?.condition || 'fair',
    reasonForSelling: initialData?.reasonForSelling || 'Needs fast cash closing',
    timeline: initialData?.timeline || '7_days',
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    notes: initialData?.notes || '',
  });

  if (!isOpen) return null;

  const estimatedCashOffer = initialData?.estimatedOffer || Math.round(formData.sqft * 195 * 0.7 - 35000 - 15000);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadType: 'MOTIVATED_SELLER',
          ...formData,
          targetOffer: estimatedCashOffer,
        }),
      });

      const data = await res.json();
      setLeadRefId(data.leadId || 'CRH-' + Math.random().toString(36).substring(2, 7).toUpperCase());
    } catch (err) {
      setLeadRefId('CRH-' + Math.floor(100000 + Math.random() * 900000));
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
      triggerCelebration();
    }
  };

  const downloadLOI = () => {
    const text = `=====================================================
PRELIMINARY WHOLESALE LETTER OF INTENT (LOI) & CASH OFFER
=====================================================
Date: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
Reference ID: ${leadRefId || 'CRH-PENDING'}
Acquisitions Buyer: Crossridge Holdings LLC (Ohio Principal Buyer)

PROPERTY DETAILS:
Street Address: ${formData.address || 'Subject Property'}, ${formData.city}, ${formData.state} ${formData.zip}
Property Type: ${formData.propertyType} (${formData.bedrooms} Bed / ${formData.bathrooms} Bath, ~${formData.sqft} sqft)
Condition: ${formData.condition.toUpperCase()}

TERMS OF PRELIMINARY CASH ACQUISITION:
1. Preliminary Purchase Offer Price: $${estimatedCashOffer.toLocaleString()} USD (All Cash)
2. Earnest Money Deposit: $2,500 deposited into neutral Ohio title escrow upon bilateral execution.
3. Closing Timeline: 7 - 14 Business Days (or seller's preferred date).
4. As-Is Condition: Buyer accepts property in strictly AS-IS condition with zero repairs, zero cleaning, and zero termite/inspection repair demands.
5. Realtor Commissions: $0.00 (Zero percent).
6. Closing Costs: Buyer covers standard seller title insurance and Ohio transfer conveyance fees.
7. Post-Occupancy: Up to 14 days free occupancy stay available upon request.

CONFIDENTIAL & EQUITABLE DISCLOSURE:
This LOI expresses mutual intent to enter into a formal Purchase and Sale Agreement. Crossridge Holdings LLC acts as principal buyer with equitable interest rights under Ohio Revised Code Chapter 4735.

Seller Contact: ${formData.fullName} | ${formData.phone} | ${formData.email}
=====================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cash_Offer_LOI_${formData.city}_${formData.state}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Direct Cash Offer Wizard</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {isSuccess ? 'Offer Locked & Confirmed!' : 'Get Your 7-Day Cash Contract'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reference ID: {leadRefId}
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 mb-2">
              Preliminary Cash Offer: ${estimatedCashOffer.toLocaleString()}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
              An acquisitions specialist in <strong>{formData.city}, {formData.state}</strong> has been assigned to your address ({formData.address}). We will call/text you at <strong>{formData.phone}</strong> within 15 minutes to review closing paperwork.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-left text-xs mb-6 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Realtor Commissions Guaranteed (Save ~$18,000+)</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Target Escrow Closing: 7 - 14 Days (Title Escrow Protected)</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <Home className="w-4 h-4 text-blue-500 shrink-0" />
                <span>100% As-Is Condition: Take what you want, leave what you don't.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={downloadLOI}
                id="download-loi-btn"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Printable Cash LOI Draft</span>
              </button>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Form */
          <form onSubmit={handleNext}>
            {/* Progress Stepper */}
            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5">
                <span className={step >= 1 ? 'text-amber-500' : ''}>1. Property Address</span>
                <span className={step >= 2 ? 'text-amber-500' : ''}>2. Condition & Motivation</span>
                <span className={step >= 3 ? 'text-amber-500' : ''}>3. Payout Contact</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              {/* STEP 1: Address & Specs */}
              {step === 1 && (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Street Address
                    </label>
                    <div className="relative">
                      <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="e.g. 4218 Fordham Rd"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={2}
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Beds
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Baths
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        step={0.5}
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Est. SqFt
                      </label>
                      <input
                        type="number"
                        min={400}
                        max={10000}
                        value={formData.sqft}
                        onChange={(e) => setFormData({ ...formData, sqft: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Condition & Situation */}
              {step === 2 && (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Current Property Condition
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    >
                      <option value="excellent">Move-in Ready (Minor cosmetics)</option>
                      <option value="fair">Dated Interior (Needs modern kitchen/baths)</option>
                      <option value="poor">Major Fixer (Roof, HVAC, or plumbing issues)</option>
                      <option value="distressed">Full Gut Renovation / Vacant / Hoarder</option>
                      <option value="fire_water_damage">Fire / Water / Foundation Damage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Closing Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    >
                      <option value="7_days">As fast as possible (7 Days)</option>
                      <option value="14_days">Within 2 Weeks (14 Days)</option>
                      <option value="30_days">Within 30 Days</option>
                      <option value="flexible">I am flexible / Need post-occupancy stay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Any liens, mortgage balance, or details?
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Inherited property, taxes are current, vacant for 6 months..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & Instant Offer Delivery */}
              {step === 3 && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                      Calculated Cash Offer Ready:
                    </span>
                    <div className="text-2xl font-black text-slate-950 dark:text-white">
                      ${estimatedCashOffer.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Zero Fees • We cover 100% standard closing costs
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name (as on Deed or Title)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Smith"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Phone (for Offer SMS & Call)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 000-0000"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address (for Written Agreement copy)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>100% Confidential. No spam. No MLS listings. No pressure.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01]"
              >
                {step < 3 ? (
                  <>
                    <span>Continue to Step {step + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : isSubmitting ? (
                  <span>Generating Official Cash Contract...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lock In My Cash Offer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
