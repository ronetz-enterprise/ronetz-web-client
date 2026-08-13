// Mock for paymentApi.initiate() — see the VITE_MOCK_CLIENT_DATA flag in paymentApi.ts.
// paymentLink stays null (mobile money push flow, no redirect — same as the real KPay
// USSD-mode integration, see bc-payments/infrastructure/psp/KPayAdapter) so PaiementPage
// takes the same "navigate straight to ConfirmationPage" branch it would in production.
import type { PaymentDto } from "../types";
import type { InitiatePaymentRequest } from "./paymentApi";

let nextId = 1;

export function mockInitiatePayment(req: InitiatePaymentRequest): PaymentDto {
  return {
    id: `pay-mock-${String(nextId++).padStart(2, "0")}`,
    subscriptionId: req.subscriptionId,
    amount: req.amount,
    currency: req.currency,
    status: "INITIATED",
    paymentLink: null,
  };
}
