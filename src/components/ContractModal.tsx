import React from 'react';
import { X, FileText, Download, Printer, ShieldCheck, Check, Copy } from 'lucide-react';
import { WholesaleProperty } from '../types';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: WholesaleProperty | null;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  onClose,
  property,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !property) return null;

  const contractText = `================================================================================
STANDARD REAL ESTATE WHOLESALE ASSIGNMENT OF CONTRACT AGREEMENT
(Equitable Interest Assignment pursuant to Applicable State Law)
================================================================================

1. PARTIES & RECITALS:
This Assignment Agreement ("Agreement") is made and entered into as of this current date, by and between:
- ASSIGNOR: US Wholesale Realty Exchange Network LLC ("Assignor")
- ASSIGNEE: Qualified Cash Buyer / Investor ("Assignee")

RECITALS:
WHEREAS, Assignor entered into a valid, enforceable bilateral Real Estate Purchase and Sale Agreement (the "Original Contract") as Buyer with the underlying Property Owner as Seller, regarding the following Real Property:
- PROPERTY ADDRESS: ${property.address}, ${property.city}, ${property.state} ${property.zip}
- LEGAL / SUBDIVISION: Single Family Residence (${property.bedrooms} Bed / ${property.bathrooms} Bath, ~${property.sqft} sqft)

WHEREAS, Assignor holds equitable title and rights under the Original Contract, which expressly provides Assignor the legal right to assign, convey, or transfer its rights and interests to an Assignee.

2. ASSIGNMENT OF RIGHTS & CONSIDERATION:
Assignor hereby assigns, transfers, and conveys to Assignee all of Assignor's right, title, claim, and interest in, to, and under the Original Contract for the following consideration:
- Base Contract Purchase Price to Seller: $${(property.contractPrice - property.assignmentFee).toLocaleString()} USD
- Assignment of Contract Fee payable to Assignor: $${property.assignmentFee.toLocaleString()} USD
- Total Purchase Price payable by Assignee: $${property.contractPrice.toLocaleString()} USD
- Stated After Repair Value (ARV): $${property.arv.toLocaleString()} USD

3. EARNEST MONEY ESCROW DEPOSIT:
Assignee shall wire a non-refundable Earnest Money Deposit of $2,500.00 USD into the designated neutral closing title company within one (1) business day of execution:
- Designated Escrow / Title Company: Fidelity National Title / First American Title Escrow
- Escrow Officer: Commercial & Residential Wholesale Escrow Division

4. AS-IS CONDITION & INDEPENDENT INSPECTION:
Assignee acknowledges and agrees that:
a) Assignee is purchasing the equitable rights to the Property in strictly "AS-IS, WHERE-IS" condition, with all faults.
b) Assignee has conducted or waived all feasibility inspections and relies solely on its own contractors and appraisers.
c) Assignee assumes all obligations, terms, and closing deadlines specified in the Original Contract.

5. CLOSING TIMELINE & DEED CONVEYANCE:
Closing and title transfer shall take place on or before: ${property.closingDeadline}.
Title company shall issue a standard Owner's Policy of Title Insurance conveying free, clear, and marketable title subject only to standard easements of record.

6. EQUITABLE DISCLOSURE STATUTE:
Assignor discloses that it is NOT a licensed real estate broker or agent and does not represent either party in an agency capacity. Assignor is marketing its own contractual rights and equitable interest created under the executed purchase agreement.

IN WITNESS WHEREOF, the parties hereto have executed this Assignment Agreement.
Assignor: US Wholesale Realty Exchange LLC
Assignee: _______________________________________ (Seal)
================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(contractText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([contractText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Wholesale_Assignment_Agreement_${property.city}_${property.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Standard Wholesale Assignment Agreement Draft
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {property.address} • Assignment Fee: ${property.assignmentFee.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Document Body */}
        <div className="p-5 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-850 select-text">
          <pre className="whitespace-pre-wrap font-sans">{contractText}</pre>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Standard US Wholesaling Assignment Template</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Contract Draft</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
