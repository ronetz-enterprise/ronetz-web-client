import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownToLine, Loader2 } from "lucide-react";
import type { WalletDto } from "../types";
import type { RequestWithdrawalPayload } from "../api/walletApi";
import { formatAmount } from "@/shared/lib/format";

interface WithdrawalDialogProps {
  wallet: WalletDto;
  onWithdraw: (payload: RequestWithdrawalPayload) => Promise<boolean>;
  loading: boolean;
}

export function WithdrawalDialog({ wallet, onWithdraw, loading }: WithdrawalDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");

  const max = wallet.balanceAmount;
  const parsed = parseFloat(amount);
  const valid = !isNaN(parsed) && parsed > 0 && parsed <= max && phone.trim().length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onWithdraw({
      amount: parsed,
      currency: wallet.balanceCurrency,
      phoneNumber: phone.trim(),
    });
    if (ok) {
      setOpen(false);
      setAmount("");
      setPhone("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={max <= 0}>
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Retirer des fonds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Demande de retrait</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
            Solde disponible :{" "}
            <span className="font-semibold">
              {formatAmount(max, wallet.balanceCurrency)}
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Montant ({wallet.balanceCurrency})</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              max={max}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Max : ${max}`}
              required
            />
            {parsed > max && (
              <p className="text-xs text-destructive">Montant supérieur au solde disponible</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro Mobile Money</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="ex : +237 6XX XXX XXX"
              required
            />
          </div>
          <Button type="submit" disabled={!valid || loading} className="w-full mt-2">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Confirmer le retrait
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
