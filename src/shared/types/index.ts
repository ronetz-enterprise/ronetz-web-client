// Shared frontend types aligned with the Spring Boot DTOs / responses.

export type UserRole = "CLIENT" | "ADMIN_WIFI" | "SUPER_ADMIN";

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}

// Auth
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string; // UUID (jwt subject)
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  domainId?: string;
  tenantId?: string;
  countryCode?: string;
}

// Identity
export interface UserDetails {
  id: string; // UUID
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  countryCode?: string | null;
  role: string;
  active: boolean;
  createdAt: string; // Instant (ISO string)
}

// Hotspot topology
export interface DomainDetails {
  id: string; // UUID
  name: string;
}

export interface Site {
  id: string; // UUID
  name: string;
  address: string;
  domainId?: string;
  countryCode?: string;
}

// RouterStatus mirrors backend RouterStatus enum
export type RouteurStatus = "PROVISIONED" | "ACTIVE" | "OFFLINE" | "DECOMMISSIONED";

export interface Routeur {
  id: string; // UUID
  name: string;
  siteId: string; // UUID
  vpnPublicKey?: string | null;
  vpnIpAddress?: string | null;
  status: RouteurStatus;
  lastHeartbeatAt?: string | null; // Instant or null
  createdAt?: string | null;
}

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

// TokenDto mirrors backend bc-access-sessions Token
export type TokenStatus = "ACTIVE" | "REVOKED" | "QUOTA_EXHAUSTED" | "EXPIRED";

export interface TokenDto {
  id: string;
  subscriptionId: string;
  siteId: string;
  siteName:string;
  username: string;
  passwordClear: string | null;
  durationMinutes: number;
  dataVolumeMb: number;
  maxConcurrentDevices: number;
  status: TokenStatus;
  issuedAt: string;
  expiresAt: string;
}

// SessionSummaryDto / TokenUsageDto mirror backend bc-access-sessions RADIUS accounting
export interface SessionSummaryDto {
  startedAt: string;
  endedAt: string | null;
  bytesUsed: number;
  terminateCause: string | null;
  nasIp: string | null;
}

export interface TokenUsageDto {
  tokenId: string;
  consumedBytes: number;
  limitBytes: number | null;
  percentUsed: number | null;
  activeDeviceCount: number;
  lastTerminateCause: string | null;
  expiresAt: string;
  remainingSeconds: number;
  recentSessions: SessionSummaryDto[];
}

// PaymentDto mirrors backend bc-payments Payment
export type PaymentStatus = "INITIATED" | "COMPLETED" | "FAILED";

export interface PaymentDto {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentLink: string | null;
}

export interface PaymentMethod {
  id: string; // UUID
  name: string;
  code: string;
  countryIds: string[];
  active: boolean;
  logoUrl?: string;
}

export interface Country {
  id: string; // UUID
  name: string;
  code: string; // ISO
  defaultCurrency: string;
  timezone:string;
  languageCode: string;
  taxRate:number;
  active: boolean;
  dialCode: string | null;
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

// Logs
export interface SystemLog {
  timestamp: string; // Instant
  level: string;
  component: string;
  message: string;
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export interface WalletDto {
  id: string;
  tenantId: string;
  balanceAmount: number;
  balanceCurrency: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = "CREDIT" | "DEBIT";

export interface WalletTransactionDto {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  referenceId: string | null;
  createdAt: string;
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export function formatDuration(minutes: number): string {
  if (minutes >= 1440) {
    const days = Math.floor(minutes / 1440);
    return `${days} jour${days > 1 ? "s" : ""}`;
  }
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h} h`;
  }
  return `${minutes} min`;
}

export function formatData(mb: number): string {
  if (mb >= 1000) {
    const gb = mb / 1000;
    return `${Number.isInteger(gb) ? gb : gb.toFixed(1)} Go`;
  }
  return `${mb} Mo`;
}

export function formatBytes(bytes: number): string {
  return formatData(bytes / (1024 * 1024));
}

export function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${new Intl.NumberFormat("fr-FR").format(amount)} ${currency}`;
  }
}

