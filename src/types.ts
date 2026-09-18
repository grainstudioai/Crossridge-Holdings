export type DealStatus = 'Assignment Ready' | 'Under Contract' | 'Off-Market Pipeline' | 'Closed & Assigned';

export type InvestmentStrategy = 'Fix & Flip' | 'Rental BRRRR' | 'Turnkey Cashflow' | 'Heavy Value-Add';

export interface WholesaleProperty {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  metroId: string;
  contractPrice: number; // Wholesaler lock-in price / buyer purchase price
  arv: number; // After Repair Value
  estimatedRepairs: number;
  assignmentFee: number;
  projectedProfit: number;
  discountPct: number; // % below ARV
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize: string;
  yearBuilt: number;
  strategy: InvestmentStrategy;
  status: DealStatus;
  imageUrl: string;
  coordinates: {
    lat: number;
    lng: number;
    // Normalized 0-100 coordinates for dynamic SVG map rendering
    x: number;
    y: number;
  };
  features: string[];
  sellerMotivation: string;
  closingDeadline: string;
  rentEstimate: number;
  comps: {
    address: string;
    salePrice: number;
    saleDate: string;
    distance: string;
  }[];
}

export interface MetroMarket {
  id: string;
  name: string;
  state: string;
  shortCode: string;
  tagline: string;
  activeDealsCount: number;
  avgDiscountPct: number;
  medianARV: number;
  avgDaysToAssign: number;
  popularZipCodes: string[];
  centerCoordinates: { x: number; y: number };
  growthTrend: string;
}

export interface ValuationMetrics {
  estimatedARV: number;
  estimatedRepairs: number;
  assignmentFee: number;
  maxAllowableOffer: number;
  fastCashOfferLow: number;
  fastCashOfferHigh: number;
  equitySpread: number;
  projectedClosingDays: number;
  sellerSavingsVsRealtor: number;
}

export interface ValuationResult {
  success: boolean;
  address: string;
  metrics: ValuationMetrics;
  aiInsight: string;
  comparableSalesNotes: string;
  negotiationTip: string;
  underwritingTimestamp: string;
}

export interface SellerLead {
  address: string;
  city: string;
  state: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: string;
  condition: 'excellent' | 'fair' | 'poor' | 'distressed' | 'fire_water_damage';
  reasonForSelling: string;
  timeline: '7_days' | '14_days' | '30_days' | 'flexible';
  fullName: string;
  phone: string;
  email: string;
  notes?: string;
}

export interface CashBuyerLead {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  preferredMetros: string[];
  maxPurchasePrice: number;
  minDiscountPct: number;
  strategies: string[];
  proofOfFundsReady: boolean;
}
