import api from "@/core/api/axiosConfig";
import type { PaymentDto } from "../types";
import { mockResponse } from "@/core/api/mockResponse";
import { mockInitiatePayment } from "./paymentApi.mock";

export interface InitiatePaymentRequest {
  subscriptionId: string;
  amount: number;
  currency: string;
  paymentMethodCode: string;
  phoneE164: string;
  email: string;
  fullName: string;
}

// See VITE_MOCK_CLIENT_DATA in forfaitApi.ts.
const USE_MOCK_CLIENT_DATA = import.meta.env.VITE_MOCK_CLIENT_DATA === "true";

export const paymentApi = {
  initiate: (data: InitiatePaymentRequest) =>{
    console.log("Initiating payment with data:", data);
    if (USE_MOCK_CLIENT_DATA) return mockResponse(mockInitiatePayment(data));
    return api.post<PaymentDto>("/api/payments/initiate", data)},
};
