// Domain model for the Network Ops bounded context (mirrors backend bc-network-ops DTOs).

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
