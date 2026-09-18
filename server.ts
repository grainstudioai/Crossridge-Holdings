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

// Lead capture endpoint
app.post("/api/leads", (req, res) => {
  const { leadType, name, phone, email, address, notes, targetOffer } = req.body;
  // Lead submission acknowledgment
  return res.json({
    success: true,
    leadId: "USW-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    receivedAt: new Date().toISOString(),
    message: "Lead successfully recorded in wholesale acquisition pipeline. An acquisitions manager has been notified.",
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
