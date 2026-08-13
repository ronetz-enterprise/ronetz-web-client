// Fixtures + in-memory mutations for tokenApi — see the VITE_MOCK_CLIENT_DATA flag in
// tokenApi.ts. One token per TokenStatus (ids match the tokenId set on the mock
// subscriptions in souscriptionApi.mock.ts) plus matching usage/session history, so
// HomePage, MesAccesPage and the revoke action all have real states to work with.
import type { TokenDto, TokenUsageDto } from "../types";

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();
const minutesFromNow = (m: number) => new Date(now + m * 60_000).toISOString();

export const mockTokens: TokenDto[] = [
  {
    id: "tok-mock-01",
    subscriptionId: "sub-mock-01",
    siteId: "site-mock-01",
    siteName: "WiFi Café Bonanjo",
    username: "wifi-2481",
    passwordClear: "Xk29fQ2h",
    durationMinutes: 1440,
    dataVolumeMb: 2000,
    maxConcurrentDevices: 2,
    status: "ACTIVE",
    issuedAt: minutesAgo(6 * 60),
    expiresAt: minutesFromNow(18 * 60),
  },
  {
    id: "tok-mock-02",
    subscriptionId: "sub-mock-04",
    siteId: "site-mock-01",
    siteName: "WiFi Café Bonanjo",
    username: "wifi-1032",
    passwordClear: null,
    durationMinutes: 1440,
    dataVolumeMb: 2000,
    maxConcurrentDevices: 2,
    status: "EXPIRED",
    issuedAt: minutesAgo(20 * 24 * 60),
    expiresAt: minutesAgo(19 * 24 * 60),
  },
  {
    id: "tok-mock-03",
    subscriptionId: "sub-mock-05",
    siteId: "site-mock-01",
    siteName: "WiFi Café Bonanjo",
    username: "wifi-3355",
    passwordClear: "Qp88zTr1",
    durationMinutes: 10080,
    dataVolumeMb: 10000,
    maxConcurrentDevices: 3,
    status: "QUOTA_EXHAUSTED",
    issuedAt: minutesAgo(5 * 24 * 60),
    expiresAt: minutesFromNow(2 * 24 * 60),
  },
  {
    id: "tok-mock-04",
    subscriptionId: "sub-mock-06",
    siteId: "site-mock-01",
    siteName: "WiFi Café Bonanjo",
    username: "wifi-0921",
    passwordClear: "Rv77hMx9",
    durationMinutes: 60,
    dataVolumeMb: 500,
    maxConcurrentDevices: 1,
    status: "REVOKED",
    issuedAt: minutesAgo(10 * 24 * 60),
    expiresAt: minutesAgo(10 * 24 * 60 - 60),
  },
];

const mb = (n: number) => n * 1024 * 1024;

function remainingSeconds(expiresAt: string): number {
  return Math.max(0, Math.round((new Date(expiresAt).getTime() - now) / 1000));
}

export const mockUsageByTokenId: Record<string, TokenUsageDto> = {
  "tok-mock-01": {
    tokenId: "tok-mock-01",
    consumedBytes: mb(670),
    limitBytes: mb(2000),
    percentUsed: 34,
    activeDeviceCount: 1,
    lastTerminateCause: null,
    expiresAt: mockTokens[0].expiresAt,
    remainingSeconds: remainingSeconds(mockTokens[0].expiresAt),
    recentSessions: [
      { startedAt: minutesAgo(15), endedAt: null, bytesUsed: mb(45), terminateCause: null, nasIp: "10.8.0.2" },
      { startedAt: minutesAgo(5 * 60), endedAt: minutesAgo(4.5 * 60), bytesUsed: mb(210), terminateCause: "User-Request", nasIp: "10.8.0.2" },
      { startedAt: minutesAgo(6 * 60), endedAt: minutesAgo(5.5 * 60), bytesUsed: mb(415), terminateCause: "Idle-Timeout", nasIp: "10.8.0.2" },
    ],
  },
  "tok-mock-02": {
    tokenId: "tok-mock-02",
    consumedBytes: mb(1850),
    limitBytes: mb(2000),
    percentUsed: 93,
    activeDeviceCount: 0,
    lastTerminateCause: "Session-Timeout",
    expiresAt: mockTokens[1].expiresAt,
    remainingSeconds: 0,
    recentSessions: [
      { startedAt: minutesAgo(19 * 24 * 60 + 30), endedAt: minutesAgo(19 * 24 * 60), terminateCause: "Session-Timeout", bytesUsed: mb(1200), nasIp: "10.8.0.3" },
      { startedAt: minutesAgo(20 * 24 * 60), endedAt: minutesAgo(19 * 24 * 60 + 45), terminateCause: "NAS-Reboot", bytesUsed: mb(650), nasIp: "10.8.0.3" },
    ],
  },
  "tok-mock-03": {
    tokenId: "tok-mock-03",
    consumedBytes: mb(10000),
    limitBytes: mb(10000),
    percentUsed: 100,
    activeDeviceCount: 0,
    lastTerminateCause: "Quota-Exceeded",
    expiresAt: mockTokens[2].expiresAt,
    remainingSeconds: remainingSeconds(mockTokens[2].expiresAt),
    recentSessions: [
      { startedAt: minutesAgo(60), endedAt: minutesAgo(20), terminateCause: "Quota-Exceeded", bytesUsed: mb(1800), nasIp: "10.8.0.2" },
      { startedAt: minutesAgo(24 * 60), endedAt: minutesAgo(23 * 60), terminateCause: "User-Request", bytesUsed: mb(3200), nasIp: "10.8.0.2" },
      { startedAt: minutesAgo(3 * 24 * 60), endedAt: minutesAgo(3 * 24 * 60 - 90), terminateCause: "Idle-Timeout", bytesUsed: mb(2600), nasIp: "10.8.0.2" },
    ],
  },
  "tok-mock-04": {
    tokenId: "tok-mock-04",
    consumedBytes: mb(120),
    limitBytes: mb(500),
    percentUsed: 24,
    activeDeviceCount: 0,
    lastTerminateCause: "Admin-Reset",
    expiresAt: mockTokens[3].expiresAt,
    remainingSeconds: 0,
    recentSessions: [
      { startedAt: minutesAgo(10 * 24 * 60), endedAt: minutesAgo(10 * 24 * 60 - 40), terminateCause: "Admin-Reset", bytesUsed: mb(120), nasIp: "10.8.0.2" },
    ],
  },
};

export function mockRevokeToken(id: string): void {
  const t = mockTokens.find((tok) => tok.id === id);
  if (t) t.status = "REVOKED";
}
