// Fixtures + in-memory mutations for souscriptionApi — see the VITE_MOCK_CLIENT_DATA flag
// in souscriptionApi.ts. One subscription per SubscriptionStatus (plus a couple extra PAID
// ones) so MesSouscriptionsPage/HomePage have every badge/section to work with. create()
// and cancel() mutate this array in place so the full "acheter -> payer -> confirmation ->
// mes souscriptions -> annuler" click-through works end to end without a backend.
import type { SubscriptionDto } from "../types";

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

export const mockSubscriptions: SubscriptionDto[] = [
  {
    id: "sub-mock-01",
    userId: "user-mock-01",
    productId: "prod-mock-02",
    siteId: "site-mock-01",
    status: "PAID",
    amount: 500,
    currency: "XAF",
    tokenId: "tok-mock-01",
    paidAt: daysAgo(0.25),
  },
  {
    id: "sub-mock-02",
    userId: "user-mock-01",
    productId: "prod-mock-03",
    siteId: "site-mock-01",
    status: "PENDING",
    amount: 2000,
    currency: "XAF",
    tokenId: null,
    paidAt: null,
  },
  {
    id: "sub-mock-03",
    userId: "user-mock-01",
    productId: "prod-mock-01",
    siteId: "site-mock-01",
    status: "CANCELLED",
    amount: 200,
    currency: "XAF",
    tokenId: null,
    paidAt: null,
  },
  {
    id: "sub-mock-04",
    userId: "user-mock-01",
    productId: "prod-mock-02",
    siteId: "site-mock-01",
    status: "EXPIRED",
    amount: 500,
    currency: "XAF",
    tokenId: "tok-mock-02",
    paidAt: daysAgo(20),
  },
  {
    id: "sub-mock-05",
    userId: "user-mock-01",
    productId: "prod-mock-03",
    siteId: "site-mock-01",
    status: "PAID",
    amount: 2000,
    currency: "XAF",
    tokenId: "tok-mock-03",
    paidAt: daysAgo(5),
  },
  {
    id: "sub-mock-06",
    userId: "user-mock-01",
    productId: "prod-mock-01",
    siteId: "site-mock-01",
    status: "PAID",
    amount: 200,
    currency: "XAF",
    tokenId: "tok-mock-04",
    paidAt: daysAgo(10),
  },
];

let nextId = mockSubscriptions.length + 1;

export function mockCreateSubscription(productId: string, siteId: string, amount: number, currency: string): SubscriptionDto {
  const sub: SubscriptionDto = {
    id: `sub-mock-${String(nextId++).padStart(2, "0")}`,
    userId: "user-mock-01",
    productId,
    siteId,
    status: "PENDING",
    amount,
    currency,
    tokenId: null,
    paidAt: null,
  };
  mockSubscriptions.unshift(sub);
  return sub;
}

export function mockCancelSubscription(id: string): void {
  const sub = mockSubscriptions.find((s) => s.id === id);
  if (sub) sub.status = "CANCELLED";
}
