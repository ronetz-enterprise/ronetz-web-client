import api from "@/core/api/axiosConfig";
import type { PaymentDto } from "@/shared/types";

export interface InitiatePaymentRequest {
  subscriptionId: string;
  amount: number;
  currency: string;
  paymentMethodCode: string;
  phoneE164: string;
  email: string;
  fullName: string;
}

export const paymentApi = {
  initiate: (data: InitiatePaymentRequest) =>{
    console.log("Initiating payment with data:", data);
    return api.post<PaymentDto>("/api/payments/initiate", data)},
};
