import axiosInstance from "@/core/api/axiosConfig";
import {type PaymentMethod } from "../types";

export const paymentMethodApi = {
  getByCountry: async (countryId: string): Promise<PaymentMethod[]> => {
    const response = await axiosInstance.get<PaymentMethod[]>(`/api/payment-methods/${countryId}`);
    return response.data;
  },
  getAll: async (): Promise<PaymentMethod[]> => {
    const response = await axiosInstance.get<PaymentMethod[]>("/api/payment-methods");
    return response.data;
  },
  create: async (paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    const response = await axiosInstance.post<PaymentMethod>("/api/payment-methods", paymentMethod);
    return response.data;
  },
};
