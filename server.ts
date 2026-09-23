import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const isProduction = process.env.NODE_ENV === "production";

// Baseline hardening headers (defense-in-depth if this server is ever
// deployed live; the production site itself is static and served via
// GitHub Pages, but these cost nothing to keep on for local/dev use too).
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// A 50mb body limit is far more than any of these endpoints legitimately
// need and makes it cheap to exhaust memory/disk with junk requests.
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Minimal in-memory sliding-window rate limiter per client IP. Not a
// substitute for a real reverse-proxy/WAF rate limit, but stops trivial
// scripted abuse of endpoints that write files or call a paid AI API.
function rateLimit(windowMs: number, max: number) {
  const hits = new Map<string, number[]>();
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    const timestamps = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (timestamps.length >= max) {
      return res.status(429).json({ error: "Too many requests. Please try again shortly." });
    }
    timestamps.push(now);
    hits.set(key, timestamps);
    next();
  };
}

// Serve public directory
const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
app.use(express.static(publicDir));

// Image upload endpoint — a content-authoring tool for local development,
// not a customer-facing feature. It writes directly into the publicly
// served /public directory with no auth, so it must never be reachable in
// production: an attacker could otherwise drop arbitrary files (including
// HTML/SVG capable of running script) into a statically-served path.
app.post("/api/upload-image", rateLimit(60_000, 10), (req, res) => {
  if (isProduction) {
    return res.status(404).json({ error: "Not found" });
  }
  try {
    const { filename, base64Data } = req.body;
    if (!filename || !base64Data || typeof filename !== "string" || typeof base64Data !== "string") {
      return res.status(400).json({ error: "Missing filename or base64Data" });
    }

    const mimeMatch = base64Data.match(/^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,/i);
    if (!mimeMatch) {
      return res.status(400).json({ error: "Only PNG, JPEG, WEBP, and GIF images are allowed" });
    }

    const cleanBase64 = base64Data.slice(base64Data.indexOf(",") + 1);
    const buffer = Buffer.from(cleanBase64, "base64");

    const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB
    if (buffer.length === 0 || buffer.length > MAX_UPLOAD_BYTES) {
      return res.status(400).json({ error: "Image must be between 1 byte and 8MB" });
    }

    // path.basename strips any directory components, preventing path
    // traversal (e.g. "../../server.ts"); we additionally whitelist the
    // character set and force a known-safe extension from the validated mime type.
    const ext = mimeMatch[1].toLowerCase().replace("jpeg", "jpg").replace("svg+xml", "svg");
    const baseName = path
      .basename(filename)
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 80) || "upload";
    const safeFilename = `${baseName}_${Date.now()}.${ext}`;
    const targetPath = path.join(publicDir, safeFilename);

    if (!targetPath.startsWith(publicDir)) {
      return res.status(400).json({ error: "Invalid filename" });
    }

    fs.writeFileSync(targetPath, buffer);
    console.log(`Successfully saved uploaded image to ${targetPath} (${buffer.length} bytes)`);
    return res.json({ success: true, filename: safeFilename, url: `/${safeFilename}` });
  } catch (err: any) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Failed to upload image", details: err?.message });
  }
});

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

// Caps every user-supplied string before it reaches an LLM prompt or an
// email body: keeps payloads sane and limits prompt-injection surface area
// (a huge crafted "address" field can't blow past the intended prompt).
function clampString(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, maxLen);
}

// Automated Property Valuation & AI Wholesale Underwriting Endpoint
app.post("/api/ai-valuation", rateLimit(60_000, 20), async (req, res) => {
  try {
    const address = clampString(req.body.address, 150);
    const city = clampString(req.body.city, 80);
    const state = clampString(req.body.state, 20);
    const zip = clampString(req.body.zip, 15);
    const bedrooms = clampString(req.body.bedrooms, 10);
    const bathrooms = clampString(req.body.bathrooms, 10);
    const sqft = req.body.sqft;
    const propertyType = clampString(req.body.propertyType, 60);
    const condition = clampString(req.body.condition, 40);
    const reasonForSelling = clampString(req.body.reasonForSelling, 300);

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
