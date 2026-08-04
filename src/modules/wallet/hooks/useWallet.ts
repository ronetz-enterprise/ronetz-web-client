import { useState, useEffect, useCallback } from "react";
import { walletApi, type RequestWithdrawalPayload } from "@/modules/wallet/api/walletApi";
import type { WalletDto, WalletTransactionDto } from "../types";
import { toast } from "sonner";

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletDto | null>(null);
  const [transactions, setTransactions] = useState<WalletTransactionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [walletRes, txRes] = await Promise.all([
        walletApi.getWallet().catch(() => null),
        walletApi.getTransactions(),
      ]);
      setWallet(walletRes?.data ?? null);
      setTransactions(txRes.data);
    } catch {
      toast.error("Impossible de charger le portefeuille");
    } finally {
      setLoading(false);
    }
  }, []);

  const requestWithdrawal = async (payload: RequestWithdrawalPayload): Promise<boolean> => {
    setWithdrawing(true);
    try {
      const { data } = await walletApi.requestWithdrawal(payload);
      setWallet(data);
      await walletApi.getTransactions().then((r) => setTransactions(r.data));
      toast.success("Retrait enregistré avec succès");
      return true;
    } catch {
      toast.error("Erreur lors de la demande de retrait");
      return false;
    } finally {
      setWithdrawing(false);
    }
  };

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { wallet, transactions, loading, withdrawing, refresh: fetchAll, requestWithdrawal };
};
