import axiosInstance from "@/core/api/axiosConfig";
import {type Country } from "../types";

export const countryApi = {
  getAll: async (): Promise<Country[]> => {
    const response = await axiosInstance.get<Country[]>("/api/countries");
    console.log(response.data);
    return response.data;
  },
  create: async (country: Partial<Country>): Promise<Country> => {
    const response = await axiosInstance.post<Country>("/api/countries", country);
    return response.data;
  },

  toggleBlock: async (countryId: string): Promise<Country> => {
    const response = await axiosInstance.patch<Country>(
      `/api/admin/countries/${countryId}/toggle-block`
    );
    return response.data;
  },
};
