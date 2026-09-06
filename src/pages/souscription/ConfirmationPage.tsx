import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, CheckCircle2, Copy, Smartphone, Wifi, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Forfait, SubscriptionDto } from "@/modules/commerce/types";
import { formatAmount } from "@/shared/lib/format";

interface SuccessState {
  success: true;
  product: Forfait;
  subscription: SubscriptionDto;
}

interface FailureState {
  success: false;
  error?: string;
}

type ConfirmationState = SuccessState | FailureState;

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ConfirmationState | null;

  const copyReference = async (reference: string) => {
    await navigator.clipboard.writeText(reference);
    toast.success("Référence copiée");
  };

  if (!state) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Redirection en cours…
        </p>
      </main>
    );
  }

  if (!state.success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <section className="w-full max-w-md rounded-lg border border-border bg-card p-7 text-center">
          <XCircle className="mx-auto size-8 text-destructive" aria-hidden="true" />
          <h1 className="mt-5 text-xl font-semibold">Paiement non effectué</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {state.error ?? "La demande n’a pas pu être initiée. Aucun montant n’a été confirmé."}
          </p>
          <div className="mt-7 grid gap-2">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Réessayer
            </Button>
            <Button variant="ghost" onClick={() => navigate("/souscriptions")}>
              Consulter mes transactions
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const { product, subscription } = state;

  return (
    <main className="min-h-screen bg-background px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-xl">
        <header>
          <span className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Confirmez le paiement sur votre téléphone
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            La demande Mobile Money a été envoyée. Votre accès sera disponible
            après validation de la transaction.
          </p>
        </header>

        <section className="mt-7 overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-start justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-xs text-muted-foreground">Forfait</p>
              <h2 className="mt-1 font-semibold">{product.name}</h2>
            </div>
            <p className="font-semibold">{formatAmount(product.price, product.currency)}</p>
          </div>
          <dl className="divide-y border-t border-border">
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <dt className="text-sm text-muted-foreground">Statut</dt>
              <dd className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                {subscription.status}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <dt className="text-sm text-muted-foreground">Référence</dt>
              <dd>
                <button
                  type="button"
                  onClick={() => copyReference(subscription.id)}
                  className="flex items-center gap-2 rounded-md px-2 py-1 font-mono text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {subscription.id.slice(0, 12)}…
                  <Copy className="size-3.5" aria-hidden="true" />
                </button>
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-7">
          <h2 className="text-sm font-semibold">Que faire maintenant ?</h2>
          <ol className="mt-4 space-y-4">
            {[
              { icon: Smartphone, text: "Validez la demande Mobile Money reçue sur votre téléphone." },
              { icon: Wifi, text: "Connectez-vous ensuite au réseau Wi-Fi du site." },
              { icon: Check, text: "Ouvrez votre accès depuis la page de vos transactions." },
            ].map(({ icon: Icon, text }, index) => (
              <li key={text} className="flex gap-3 text-sm">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <p className="pt-1 leading-5">
                  <span className="mr-1 text-muted-foreground">{index + 1}.</span>
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          <Button onClick={() => navigate("/souscriptions")}>Suivre la transaction</Button>
          <Button
            variant="outline"
            onClick={() => navigate("/acheter/" + subscription.siteId)}
          >
            Acheter un autre forfait
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ConfirmationPage;
