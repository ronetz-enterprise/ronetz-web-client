import api from "@/core/api/axiosConfig";
import type { DomainDetails, Site } from "../types";

export type CreateDomainRequest = Pick<DomainDetails, "name">;
export type CreateSiteRequest = { name: string; address: string, countryCode?: string };

export const siteApi = {
  checkTenantHasDomain:()=> api.post("/api/domains/check"),
  createDomain: (data: CreateDomainRequest) =>
    api.post<DomainDetails>("/api/domains", data),

  getDomains: () =>
    api.get<DomainDetails[]>("/api/domains"),

  getSites: () =>
    api.get<Site[]>("/api/sites"),

  createSite: (data: CreateSiteRequest) =>
    api.post<Site>("/api/sites", data),
};
