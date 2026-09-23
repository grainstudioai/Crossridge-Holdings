import React, { useRef, useState } from 'react';
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
  Send,
  Lock,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SellerLead } from '../types';
import { submitLead, buildMailtoLink } from '../lib/leadSubmit';
import { HCaptchaWidget, HCaptchaWidgetHandle, getHCaptchaSiteKey } from './HCaptchaWidget';

interface SellerLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<SellerLead>;
}

export const SellerLeadModal: React.FC<SellerLeadModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [leadRefId, setLeadRefId] = useState<string>('');
  const [mailtoLink, setMailtoLink] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const captchaRef = useRef<HCaptchaWidgetHandle>(null);
  const captchaRequired = Boolean(getHCaptchaSiteKey());

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
    reasonForSelling: initialData?.reasonForSelling || 'Needs straightforward sale',
    timeline: initialData?.timeline || '7_days',
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    notes: initialData?.notes || '',
  });

  if (!isOpen) return null;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
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
    setSubmitError(false);

    const subject = `[New Seller Property Review] ${formData.address}, ${formData.city}, ${formData.state}`;
    const body =
      `Property Address: ${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}\n` +
      `Beds/Baths: ${formData.bedrooms}/${formData.bathrooms}\n` +
      `SqFt: ${formData.sqft}\n` +
      `Property Type: ${formData.propertyType}\n` +
      `Condition: ${formData.condition}\n` +
      `Timeline: ${formData.timeline}\n` +
      `Notes: ${formData.notes || 'None'}\n\n` +
      `Seller Contact:\n` +
      `Name: ${formData.fullName}\n` +
      `Phone: ${formData.phone}\n` +
      `Email: ${formData.email}`;

    const { ok, refId } = await submitLead(
      subject,
      {
        lead_type: 'SELLER_PROPERTY_SUBMISSION',
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        property_address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        sqft: formData.sqft,
        property_type: formData.propertyType,
        condition: formData.condition,
        timeline: formData.timeline,
        notes: formData.notes,
        message: body,
      },
      { honeypot, captchaToken }
    );

    setLeadRefId(refId);
    setMailtoLink(buildMailtoLink(subject, body));
    setIsSubmitting(false);
    setIsSuccess(ok);
    setSubmitError(!ok);
    if (ok) {
      triggerCelebration();
    } else {
      captchaRef.current?.reset();
      setCaptchaToken('');
    }
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
              <span>Crossridge Holdings Property Review</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {isSuccess ? 'Property Details Received' : submitError ? 'Submission Issue' : 'Submit Your Property for Review'}
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
              Property Submitted for Review
            </h4>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 max-w-md mx-auto mb-5 text-left">
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                Email dispatched to <strong>info@crossridgeholdingsllc.com</strong>. We review the property, recent comparable sales, and its condition to determine whether it may fit criteria from investors in our network.
              </p>
            </div>

            {/* Submission Summary Card */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-left text-xs mb-6 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400">Property:</span>
                <span className="font-bold text-slate-900 dark:text-white text-right">
                  {formData.address || 'Address provided'}, {formData.city}, {formData.state} {formData.zip}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Specs:</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">
                  {formData.bedrooms} Bed / {formData.bathrooms} Bath • ~{formData.sqft} sqft
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Contact:</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">
                  {formData.fullName} ({formData.phone})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Recipient:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  info@crossridgeholdingsllc.com
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {mailtoLink && (
                <a
                  href={mailtoLink}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Email Copy</span>
                </a>
              )}
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : submitError ? (
          /* Error Screen — the automatic email failed, ask the visitor to send it directly */
          <div className="p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <X className="w-8 h-8" />
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 mb-2">
              We Couldn't Send That Automatically
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
              Please tap the button below to send your property details to our team directly from your email app.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={mailtoLink}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Email to Our Team</span>
              </a>
              <button
                type="button"
                onClick={() => setSubmitError(false)}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Form */
          <form onSubmit={handleNext}>
            {/* Honeypot: hidden from real visitors, bots that auto-fill every field trip it */}
            <input
              type="text"
              name="company_website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />

            {/* Real Review Philosophy Subhead */}
            <div className="px-6 pt-3 pb-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">We Review the Property:</strong> We review the property, recent comparable sales, and its condition to determine whether it may fit criteria from investors in our network. Submissions are delivered directly to <strong className="text-amber-600 dark:text-amber-400">info@crossridgeholdingsllc.com</strong>.
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="px-6 pt-3 pb-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5">
                <span className={step >= 1 ? 'text-amber-500' : ''}>1. Property Address</span>
                <span className={step >= 2 ? 'text-amber-500' : ''}>2. Condition & Timeline</span>
                <span className={step >= 3 ? 'text-amber-500' : ''}>3. Contact Details</span>
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
                        maxLength={120}
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
                        maxLength={60}
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
                        maxLength={12}
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
                      <option value="excellent">Move-In Ready (Already updated or minor cosmetics)</option>
                      <option value="fair">Older or Partially Renovated (Dated interior)</option>
                      <option value="poor">Needs Major Repairs (Roof, HVAC, plumbing, structural)</option>
                      <option value="distressed">Vacant Property / Full Gut Renovation</option>
                      <option value="fire_water_damage">Inherited or Rental Property</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    >
                      <option value="7_days">As fast as possible (7 Days)</option>
                      <option value="14_days">Within 2 Weeks (14 Days)</option>
                      <option value="30_days">Within 30 Days</option>
                      <option value="flexible">Flexible / Need time to relocate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Any additional notes or details about the house?
                    </label>
                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Vacant for a few months, inherited from family, rental with tenants, needs new roof..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & Submission */}
              {step === 3 && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-left">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Direct Team Property Review</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      We will review your property, recent comparable sales, and its condition to determine investor criteria fit. Your submission goes directly to <strong>info@crossridgeholdingsllc.com</strong>.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        maxLength={100}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Smith"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        maxLength={30}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 000-0000"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        maxLength={150}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>100% Confidential. No obligations. Dispatched directly to our acquisitions team.</span>
                  </div>

                  <HCaptchaWidget ref={captchaRef} onVerify={setCaptchaToken} onExpire={() => setCaptchaToken('')} />
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
                disabled={isSubmitting || (step === 3 && captchaRequired && !captchaToken)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {step < 3 ? (
                  <>
                    <span>Continue to Step {step + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : isSubmitting ? (
                  <span>Submitting Details to Team...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Get Your Cash Offer</span>
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
