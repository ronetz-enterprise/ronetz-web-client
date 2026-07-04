import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TopologyState {
  domainId: string | null;
  activeSiteId: string | null;
  setDomainId: (domainId: string | null) => void;
  setActiveSiteId: (siteId: string | null) => void;
  clear: () => void;
}

export const useTopologyStore = create<TopologyState>()(
  persist(
    (set) => ({
      domainId: null,
      activeSiteId: null,
      setDomainId: (domainId) => set({ domainId }),
      setActiveSiteId: (activeSiteId) => set({ activeSiteId }),
      clear: () => set({ domainId: null, activeSiteId: null }),
    }),
    { name: "topology-storage" }
  )
);

