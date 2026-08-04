// Domain model for the Wallet bounded context (mirrors backend bc-wallet DTOs).

export interface WalletDto {
  id: string;
  tenantId: string;
  balanceAmount: number;
  balanceCurrency: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = "CREDIT" | "DEBIT";

export interface WalletTransactionDto {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  referenceId: string | null;
  createdAt: string;
}
