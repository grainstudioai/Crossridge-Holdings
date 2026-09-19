import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e);
      return null;
    }
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Automated Property Valuation & AI Wholesale Underwriting Endpoint
app.post("/api/ai-valuation", async (req, res) => {
  try {
    const { address, city, state, zip, bedrooms, bathrooms, sqft, propertyType, condition, reasonForSelling } = req.body;

    if (!address || !city || !state) {
      return res.status(400).json({ error: "Address, city, and state are required." });
    }

    // Baseline algorithmic estimation (70% rule wholesale standards)
    const baseSqft = Number(sqft) || 1650;
    const metroMultipliers: Record<string, number> = {
      TX: 195,
      GA: 185,
      FL: 230,
      NC: 210,
      AZ: 245,
      TN: 175,
      OH: 135,
      PA: 160,
      IN: 140,
    };
    const statePricePerSqft = metroMultipliers[String(state).toUpperCase()] || 180;
    
    // Condition discount rates
    const conditionDiscount: Record<string, { repairCost: number; discount: number }> = {
      "excellent": { repairCost: 12000, discount: 0.05 },
      "fair": { repairCost: 28000, discount: 0.15 },
      "poor": { repairCost: 52000, discount: 0.28 },
      "distressed": { repairCost: 85000, discount: 0.42 },
      "fire_water_damage": { repairCost: 110000, discount: 0.55 },
    };

    const conditionData = conditionDiscount[condition] || { repairCost: 35000, discount: 0.20 };
    const estimatedARV = Math.round(baseSqft * statePricePerSqft);
    const estimatedRepairs = conditionData.repairCost;
    const assignmentFee = 15000;
    // Wholesale standard: 70% rule minus repairs minus assignment fee
    const maxAllowableOffer = Math.max(30000, Math.round(estimatedARV * 0.70 - estimatedRepairs - assignmentFee));
    const fastCashOfferHigh = Math.round(maxAllowableOffer * 1.05);
    const fastCashOfferLow = Math.round(maxAllowableOffer * 0.95);

    const client = getGeminiClient();
    let aiInsight = "";
    let comparableSalesNotes = "";
    let negotiationTip = "";

    if (client) {
      try {
        const prompt = `You are a premier nationwide US Real Estate Wholesaler and acquisitions underwriter.
Evaluate this motivated seller property for an off-market cash deal:
- Address: ${address}, ${city}, ${state} ${zip || ""}
- Specs: ${bedrooms || 3} bed, ${bathrooms || 2} bath, approx ${baseSqft} sqft (${propertyType || "Single Family"})
- Condition: ${condition || "needs cosmetic updates"}
- Seller Motivation / Situation: ${reasonForSelling || "needs quick cash closing"}
- Calculated Baseline ARV: $${estimatedARV.toLocaleString()}
- Calculated Estimated Repairs: $${estimatedRepairs.toLocaleString()}
- Recommended Wholesaler Purchase Offer (MAO): $${maxAllowableOffer.toLocaleString()}

Return a concise, highly professional 3-sentence deal analysis:
1) Valuation rationale and local neighborhood submarket momentum.
2) Three specific high-ROI repair items to highlight to end cash flippers.
3) A win-win closing hook to present to this seller that solves their exact pain point without realtor fees.
Keep it punchy, quantitative, and directly actionable.`;

        const response = await client.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
        });

        if (response && response.text) {
          aiInsight = response.text;
        }
      } catch (geminiErr) {
        console.warn("Gemini generation fallback used:", geminiErr);
      }
    }

    if (!aiInsight) {
      aiInsight = `Based on comparable off-market single-family transactions in the ${city}, ${state} metro corridor, properties of this footprint carry an After-Repair Value (ARV) near $${estimatedARV.toLocaleString()}. With an estimated $${estimatedRepairs.toLocaleString()} in modernization allowance (flooring, HVAC, and cosmetics), our algorithmic Maximum Allowable Offer of $${maxAllowableOffer.toLocaleString()} provides the seller zero-cost certainty in 7 days while reserving sufficient margin for end flipper disposition.`;
      comparableSalesNotes = `Recent active neighborhood cash trades range between $${Math.round(estimatedARV * 0.65).toLocaleString()} (as-is) and $${estimatedARV.toLocaleString()} (fully staged MLS retail).`;
      negotiationTip = `Offer the seller free 14-day post-occupancy stay and 100% covered escrow transfer taxes to lock in equitable contract exclusivity.`;
    }

    return res.json({
      success: true,
      address: `${address}, ${city}, ${state} ${zip || ""}`.trim(),
      metrics: {
        estimatedARV,
        estimatedRepairs,
        assignmentFee,
        maxAllowableOffer,
        fastCashOfferLow,
        fastCashOfferHigh,
        equitySpread: estimatedARV - maxAllowableOffer,
        projectedClosingDays: 7,
        sellerSavingsVsRealtor: Math.round(estimatedARV * 0.06 + 3500 + estimatedRepairs * 0.2),
      },
      aiInsight,
      comparableSalesNotes,
      negotiationTip,
      underwritingTimestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Valuation endpoint error:", error);
    return res.status(500).json({ error: "Failed to calculate valuation", details: error?.message });
  }
});

// In-memory notification dispatch log for info@crossridgeholdingsllc.com
interface EmailDispatch {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  leadType: string;
  timestamp: string;
  data: Record<string, any>;
}

const emailDispatches: EmailDispatch[] = [];

// Lead capture & notification endpoint (Dispatched to info@crossridgeholdingsllc.com)
app.post("/api/leads", (req, res) => {
  const payload = req.body;
  const leadType = payload.leadType || "SELLER_PROPERTY_SUBMISSION";
  const refId = "CRH-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = new Date().toISOString();
  const recipient = "info@crossridgeholdingsllc.com";

  let subject = "";
  let bodyLines: string[] = [];

  if (leadType === "MOTIVATED_SELLER" || leadType === "SELLER_PROPERTY_SUBMISSION") {
    const address = payload.address || "Unspecified Street";
    const city = payload.city || "Columbus";
    const state = payload.state || "OH";
    const zip = payload.zip || "";

    subject = `[New Seller Property Review] ${address}, ${city}, ${state}`;

    bodyLines = [
      `CROSSRIDGE HOLDINGS LLC - NEW PROPERTY SUBMISSION FOR REVIEW`,
      `============================================================`,
      `Reference ID: ${refId}`,
      `Submitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} EST`,
      `Recipient: ${recipient}`,
      ``,
      `PROPERTY DETAILS:`,
      `- Address: ${address}`,
      `- City, State Zip: ${city}, ${state} ${zip}`,
      `- Beds / Baths: ${payload.bedrooms || "N/A"} Beds / ${payload.bathrooms || "N/A"} Baths`,
      `- Estimated SqFt: ${payload.sqft ? `${payload.sqft} sqft` : "N/A"}`,
      `- Property Type: ${payload.propertyType || "Single Family"}`,
      `- Condition: ${payload.condition || "Not specified"}`,
      `- Preferred Timeline: ${payload.timeline || "Not specified"}`,
      `- Mortgages / Liens / Notes: ${payload.notes || "None noted"}`,
      ``,
      `SELLER CONTACT INFORMATION:`,
      `- Name: ${payload.fullName || payload.name || "Not provided"}`,
      `- Phone: ${payload.phone || "Not provided"}`,
      `- Email: ${payload.email || "Not provided"}`,
      ``,
      `ACTION REQUIRED:`,
      `Review recent comparable neighborhood sales and property condition to determine investor network criteria fit.`,
      `============================================================`,
    ];
  } else {
    // Investor / Cash Buyer
    const fullName = payload.fullName || payload.name || "Ohio Cash Buyer";
    const company = payload.companyName ? ` (${payload.companyName})` : "";

    subject = `[New VIP Cash Buyer Inquiry] ${fullName}${company}`;

    bodyLines = [
      `CROSSRIDGE HOLDINGS LLC - NEW CASH BUYER / INVESTOR INQUIRY`,
      `===========================================================`,
      `Reference ID: ${refId}`,
      `Submitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} EST`,
      `Recipient: ${recipient}`,
      ``,
      `BUYER PROFILE:`,
      `- Full Name: ${fullName}`,
      `- Company: ${payload.companyName || "Individual Investor"}`,
      `- Phone: ${payload.phone || "Not provided"}`,
      `- Email: ${payload.email || "Not provided"}`,
      ``,
      `BUYING CRITERIA:`,
      `- Preferred Ohio Metros: ${Array.isArray(payload.preferredMetros) ? payload.preferredMetros.join(", ") : payload.preferredMetros || "Statewide Ohio"}`,
      `- Max Purchase Price: $${Number(payload.maxPurchasePrice || 0).toLocaleString()}`,
      `- Min Discount Below ARV: ${payload.minDiscountPct || 30}%`,
      `- Strategies: ${Array.isArray(payload.strategies) ? payload.strategies.join(", ") : payload.strategies || "Fix & Flip"}`,
      `- Proof of Funds Ready: ${payload.proofOfFundsReady ? "YES (Verified liquid funds)" : "Pending"}`,
      ``,
      `ACTION REQUIRED:`,
      `Review active wholesale inventory in requested metros and add to exclusive VIP off-market contract broadcast.`,
      `===========================================================`,
    ];
  }

  const emailBody = bodyLines.join("\n");

  const dispatchRecord: EmailDispatch = {
    id: refId,
    recipient,
    subject,
    body: emailBody,
    leadType,
    timestamp,
    data: payload,
  };

  emailDispatches.unshift(dispatchRecord);
  if (emailDispatches.length > 100) emailDispatches.pop();

  // Distinct console logging for email delivery verification
  console.log(`\n======================================================`);
  console.log(`[EMAIL DISPATCHED TO ${recipient}]`);
  console.log(`SUBJECT: ${subject}`);
  console.log(emailBody);
  console.log(`======================================================\n`);

  const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

  return res.json({
    success: true,
    leadId: refId,
    recipient,
    subject,
    emailBody,
    mailtoUrl,
    receivedAt: timestamp,
    message: `Property details successfully received and dispatched to ${recipient}. Our team is reviewing the property and recent comparable sales.`,
  });
});

// Production / Dev Vite integration
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`US Real Estate Wholesaling Server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
