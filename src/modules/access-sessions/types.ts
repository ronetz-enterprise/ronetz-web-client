// Domain model for the Access Sessions bounded context (mirrors backend bc-access-sessions DTOs).

export type TokenStatus = "ACTIVE" | "REVOKED" | "QUOTA_EXHAUSTED" | "EXPIRED";

export interface TokenDto {
  id: string;
  subscriptionId: string;
  siteId: string;
  siteName: string;
  username: string;
  passwordClear: string | null;
  durationMinutes: number;
  dataVolumeMb: number;
  maxConcurrentDevices: number;
  status: TokenStatus;
  issuedAt: string;
  expiresAt: string;
}

// SessionSummaryDto / TokenUsageDto mirror backend RADIUS accounting
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
