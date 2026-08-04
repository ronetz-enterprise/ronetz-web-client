import api from "@/core/api/axiosConfig";
import type { WalletDto, WalletTransactionDto } from "../types";

export interface RequestWithdrawalPayload {
  amount: number;
  currency: string;
  phoneNumber: string;
}

export const walletApi = {
  getWallet: () => api.get<WalletDto>("/api/wallet"),
  getTransactions: () => api.get<WalletTransactionDto[]>("/api/wallet/transactions"),
  requestWithdrawal: (data: RequestWithdrawalPayload) =>
    api.post<WalletDto>("/api/wallet/withdraw", data),
};
