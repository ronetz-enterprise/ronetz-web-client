import axiosInstance from "@/core/api/axiosConfig";
import {type PaymentMethod } from "../types";
import { mockPaymentMethods } from "./paymentMethodApi.mock";

// See VITE_MOCK_CLIENT_DATA in forfaitApi.ts.
const USE_MOCK_CLIENT_DATA = import.meta.env.VITE_MOCK_CLIENT_DATA === "true";

export const paymentMethodApi = {
  getByCountry: async (countryId: string): Promise<PaymentMethod[]> => {
    if (USE_MOCK_CLIENT_DATA) return mockPaymentMethods.filter((m) => m.countryIds.includes(countryId));
    const response = await axiosInstance.get<PaymentMethod[]>(`/api/payment-methods/${countryId}`);
    return response.data;
  },
  getAll: async (): Promise<PaymentMethod[]> => {
    if (USE_MOCK_CLIENT_DATA) return mockPaymentMethods;
    const response = await axiosInstance.get<PaymentMethod[]>("/api/payment-methods");
    return response.data;
  },
  create: async (paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    const response = await axiosInstance.post<PaymentMethod>("/api/payment-methods", paymentMethod);
    return response.data;
  },
};
