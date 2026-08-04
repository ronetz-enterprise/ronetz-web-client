// Domain model for the Commerce bounded context (mirrors backend bc-commerce DTOs).

// ProductDto mirrors backend bc-commerce Product
export interface Forfait {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  durationMinutes: number;
  dataVolumeMb: number;
  maxConcurrentDevices: number;
  active: boolean;
  siteIds?: string[];
}

// SubscriptionDto mirrors backend bc-commerce Subscription
export type SubscriptionStatus = "PENDING" | "PAID" | "CANCELLED" | "EXPIRED";

export interface SubscriptionDto {
  id: string;          // UUID
  userId: string;
  productId: string;
  siteId: string;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  tokenId: string | null;
  paidAt: string | null; // Instant
}

// Legacy souscription types kept for ConfirmationPage backward compatibility
export type PaymentProvider = string;

export type SouscriptionStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_FAILED"
  | "PENDING_RADIUS"
  | "RADIUS_FAILED"
  | "COMPLETED";

export interface SouscriptionDetails {
  id: string;
  status: SouscriptionStatus;
  transactionId?: string | null;
  gatewayUrl?: string | null;
  jetonCode?: string | null;
  validUntil?: string | null;
}
