import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  CheckCircle2,
  Send,
  Mail,
  Phone,
  Building,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WholesaleProperty, MetroMarket, CashBuyerLead } from '../types';
import { submitLead, buildMailtoLink } from '../lib/leadSubmit';

interface CashBuyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProperty?: WholesaleProperty;
  metros: MetroMarket[];
}

export const CashBuyerModal: React.FC<CashBuyerModalProps> = ({
  isOpen,
  onClose,
  targetProperty,
  metros,
}) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mailtoLink, setMailtoLink] = useState<string>('');
  const [leadRefId, setLeadRefId] = useState<string>('');

  const [buyerData, setBuyerData] = useState<CashBuyerLead>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    preferredMetros: targetProperty ? [targetProperty.metroId] : ['columbus', 'cleveland', 'cincinnati'],
    maxPurchasePrice: targetProperty ? targetProperty.contractPrice + 50000 : 350000,
    minDiscountPct: 30,
    strategies: [targetProperty?.strategy || 'Fix & Flip'],
    proofOfFundsReady: true,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    const subject = `[New VIP Cash Buyer Inquiry] ${buyerData.fullName}${buyerData.companyName ? ` (${buyerData.companyName})` : ''}`;
    const body =
      `Investor: ${buyerData.fullName}\n` +
      `Company: ${buyerData.companyName || 'N/A'}\n` +
      `Phone: ${buyerData.phone}\n` +
      `Email: ${buyerData.email}\n` +
      `Preferred Metros: ${buyerData.preferredMetros.join(', ')}\n` +
      `Max Purchase Price: $${buyerData.maxPurchasePrice}\n` +
      `Min Discount Below ARV: ${buyerData.minDiscountPct}%\n` +
      `Strategies: ${buyerData.strategies.join(', ')}\n` +
      `Proof of Funds Ready: ${buyerData.proofOfFundsReady ? 'Yes' : 'Pending'}\n` +
      `Target Property: ${targetProperty?.address || 'General List'}`;

    const { ok, refId } = await submitLead(subject, {
      lead_type: targetProperty ? 'DEAL_CONTRACT_LOCK' : 'VIP_CASH_BUYER',
      target_property_id: targetProperty?.id,
      target_property_address: targetProperty?.address,
      full_name: buyerData.fullName,
      company_name: buyerData.companyName,
      phone: buyerData.phone,
      email: buyerData.email,
      preferred_metros: buyerData.preferredMetros.join(', '),
      max_purchase_price: buyerData.maxPurchasePrice,
      min_discount_pct: buyerData.minDiscountPct,
      strategies: buyerData.strategies.join(', '),
      proof_of_funds_ready: buyerData.proofOfFundsReady,
      message: body,
    });

    setLeadRefId(refId);
    setMailtoLink(buildMailtoLink(subject, body));
    setIsSubmitting(false);
    setIsSuccess(ok);
    setSubmitError(!ok);

    if (ok) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#06b6d4'],
        });
      } catch (e) {}
    }
  };

  const toggleMetro = (metroId: string) => {
    if (buyerData.preferredMetros.includes(metroId)) {
      setBuyerData({
        ...buyerData,
        preferredMetros: buyerData.preferredMetros.filter((id) => id !== metroId),
      });
    } else {
      setBuyerData({
        ...buyerData,
        preferredMetros: [...buyerData.preferredMetros, metroId],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{targetProperty ? 'Property Inquiry & Assignment' : 'Ohio Cash Buyers Network'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {targetProperty ? targetProperty.address : 'Join Exclusive Ohio Buyers Network'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            {leadRefId && (
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Reference ID: {leadRefId}
              </span>
            )}

            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1 mb-2">
              {targetProperty ? 'Property Inquiry Dispatched' : 'Buyer Criteria Received'}
            </h4>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 max-w-sm mx-auto mb-5 text-left">
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                Email dispatched to <strong>info@crossridgeholdingsllc.com</strong>. Our team will review your buying criteria and match you with off-market wholesale contracts across your preferred Ohio metros.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-left mb-6 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{buyerData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient Email:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">info@crossridgeholdingsllc.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Metros:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {buyerData.preferredMetros.join(', ') || 'Statewide Ohio'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              {mailtoLink && (
                <a
                  href={mailtoLink}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Email Copy</span>
                </a>
              )}
              <button
                onClick={onClose}
                className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Close & View Inventory
              </button>
            </div>
          </div>
        ) : submitError ? (
          /* Error Screen — the automatic email failed, ask the visitor to send it directly */
          <div className="p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <X className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1 mb-2">
              We Couldn't Send That Automatically
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto mb-6">
              Please tap the button below to send your buying criteria to our team directly from your email app.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={mailtoLink}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email to Our Team</span>
              </a>
              <button
                type="button"
                onClick={() => setSubmitError(false)}
                className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
            {/* Direct Email Routing Notice */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
              When you submit, your criteria is sent directly to <strong className="text-amber-600 dark:text-amber-400">info@crossridgeholdingsllc.com</strong> for review and property matching.
            </div>

            {targetProperty && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                    Subject Wholesale Contract
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {targetProperty.address}, {targetProperty.city}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    Buy Price: <strong>${targetProperty.contractPrice.toLocaleString()}</strong> • ARV: ${targetProperty.arv.toLocaleString()}
                  </div>
                </div>
                <div className="text-right font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                  +{targetProperty.discountPct}% off ARV
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={buyerData.fullName}
                  onChange={(e) => setBuyerData({ ...buyerData, fullName: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  LLC / Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={buyerData.companyName}
                  onChange={(e) => setBuyerData({ ...buyerData, companyName: e.target.value })}
                  placeholder="e.g. Apex Equity LLC"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Phone (SMS Deal Alerts)
                </label>
                <input
                  type="tel"
                  required
                  value={buyerData.phone}
                  onChange={(e) => setBuyerData({ ...buyerData, phone: e.target.value })}
                  placeholder="(555) 000-0000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={buyerData.email}
                  onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                  placeholder="investor@domain.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Target Metros Selector */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Ohio Metros (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {metros.map((m) => {
                  const selected = buyerData.preferredMetros.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMetro(m.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                        selected
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {m.shortCode} - {m.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Proof of funds checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="pof-ready"
                checked={buyerData.proofOfFundsReady}
                onChange={(e) => setBuyerData({ ...buyerData, proofOfFundsReady: e.target.checked })}
                className="mt-0.5 accent-amber-500 rounded"
              />
              <label htmlFor="pof-ready" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                <strong>Proof of Funds Ready:</strong> I have liquid cash or pre-approved private capital ready to close in 7 - 14 days without mortgage contingencies.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl shadow-md shadow-emerald-500/20 transition-all text-xs sm:text-sm"
            >
              {isSubmitting ? (
                <span>Submitting to info@crossridgeholdingsllc.com...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{targetProperty ? 'Submit Property Inquiry' : 'Join VIP Cash Buyers Network'}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
