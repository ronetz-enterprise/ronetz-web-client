// Fixtures for paymentMethodApi.getByCountry()/getAll() — see the VITE_MOCK_CLIENT_DATA
// flag in paymentMethodApi.ts. Mirrors the real backend seed (payment_methods table,
// ORANGE_MONEY_CM / MTN_MOMO_CM — see platform-app V17/V31 migrations) so MethodStep looks
// exactly like production. No logoUrl on either: same as the real data today, exercises
// MethodStep's initials-badge fallback.
import type { PaymentMethod } from "../types";

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm-mock-01",
    name: "Orange Money Cameroun",
    code: "ORANGE_MONEY_CM",
    countryIds: ["CM"],
    active: true,
  },
  {
    id: "pm-mock-02",
    name: "MTN Mobile Money",
    code: "MTN_MOMO_CM",
    countryIds: ["CM"],
    active: true,
  },
];
