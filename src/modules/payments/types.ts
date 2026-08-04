// Domain model for the Payments bounded context (mirrors backend bc-payments DTOs).

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
