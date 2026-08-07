// Fixtures for routeurApi.list() — see the USE_MOCK_ROUTEURS flag in
// routeurApi.ts. 10 routers spread across every RouteurStatus, several
// sites and a wide range of createdAt/lastHeartbeatAt (including a couple
// of nulls), so sorting, search and pagination all have something real to
// exercise without a backend running.
import type { Routeur } from "../types";

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();

export const mockRouteurs: Routeur[] = [
  {
    id: "r-mock-01",
    name: "RTR-DOUALA-BONANJO-01",
    siteId: "site-mock-01",
    vpnPublicKey: "AbCdEf1234567890+MockKeyDoualaBonanjo01==",
    vpnIpAddress: "10.8.0.2",
    status: "ACTIVE",
    lastHeartbeatAt: minutesAgo(2),
    createdAt: minutesAgo(60 * 24 * 30),
  },
  {
    id: "r-mock-02",
    name: "RTR-DOUALA-AKWA-02",
    siteId: "site-mock-01",
    vpnPublicKey: "GhIjKl1234567890+MockKeyDoualaAkwa02==",
    vpnIpAddress: "10.8.0.3",
    status: "ACTIVE",
    lastHeartbeatAt: minutesAgo(14),
    createdAt: minutesAgo(60 * 24 * 25),
  },
  {
    id: "r-mock-03",
    name: "RTR-YAOUNDE-CENTRE-01",
    siteId: "site-mock-02",
    vpnPublicKey: null,
    vpnIpAddress: null,
    status: "PROVISIONED",
    lastHeartbeatAt: null,
    createdAt: minutesAgo(60 * 6),
  },
  {
    id: "r-mock-04",
    name: "RTR-YAOUNDE-BASTOS-03",
    siteId: "site-mock-02",
    vpnPublicKey: "MnOpQr1234567890+MockKeyYaoundeBastos03==",
    vpnIpAddress: "10.8.0.5",
    status: "OFFLINE",
    lastHeartbeatAt: minutesAgo(60 * 9),
    createdAt: minutesAgo(60 * 24 * 60),
  },
  {
    id: "r-mock-05",
    name: "RTR-BAFOUSSAM-01",
    siteId: "site-mock-03",
    vpnPublicKey: "StUvWx1234567890+MockKeyBafoussam01==",
    vpnIpAddress: "10.8.0.9",
    status: "ACTIVE",
    lastHeartbeatAt: minutesAgo(1),
    createdAt: minutesAgo(60 * 24 * 10),
  },
  {
    id: "r-mock-06",
    name: "RTR-GAROUA-LEGACY-01",
    siteId: "site-mock-04",
    vpnPublicKey: "YzAbCd1234567890+MockKeyGaroua01==",
    vpnIpAddress: null,
    status: "DECOMMISSIONED",
    lastHeartbeatAt: minutesAgo(60 * 24 * 120),
    createdAt: minutesAgo(60 * 24 * 400),
  },
  {
    id: "r-mock-07",
    name: "RTR-BAMENDA-COMMERCIAL-01",
    siteId: "site-mock-05",
    vpnPublicKey: "EfGhIj1234567890+MockKeyBamenda01==",
    vpnIpAddress: "10.8.0.12",
    status: "ACTIVE",
    lastHeartbeatAt: minutesAgo(45),
    createdAt: minutesAgo(60 * 24 * 3),
  },
  {
    id: "r-mock-08",
    name: "RTR-KRIBI-PLAGE-01",
    siteId: "site-mock-06",
    vpnPublicKey: null,
    vpnIpAddress: null,
    status: "PROVISIONED",
    lastHeartbeatAt: null,
    createdAt: minutesAgo(30),
  },
  {
    id: "r-mock-09",
    name: "RTR-MAROUA-CENTRE-01",
    siteId: "site-mock-07",
    vpnPublicKey: "KlMnOp1234567890+MockKeyMaroua01==",
    vpnIpAddress: "10.8.0.18",
    status: "OFFLINE",
    lastHeartbeatAt: minutesAgo(60 * 30),
    createdAt: minutesAgo(60 * 24 * 90),
  },
  {
    id: "r-mock-10",
    name: "RTR-BUEA-MOLYKO-OLD-01",
    siteId: "site-mock-08",
    vpnPublicKey: "QrStUv1234567890+MockKeyBuea01==",
    vpnIpAddress: null,
    status: "DECOMMISSIONED",
    lastHeartbeatAt: minutesAgo(60 * 24 * 200),
    createdAt: minutesAgo(60 * 24 * 500),
  },
];
