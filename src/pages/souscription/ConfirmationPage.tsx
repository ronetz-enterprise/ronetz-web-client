import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ReceiptText,
  Smartphone,
  Wifi,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(label + " copié !");
  };

  if (!state) {
    return (
      <main className="ronet-grid flex min-h-screen items-center justify-center bg-background p-6">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Redirection en cours…
        </p>
      </main>
    );
  }

  if (!state.success) {
    return (
      <main className="ronet-grid flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <section className="ronet-surface w-full max-w-lg p-7 text-center sm:p-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="size-8 text-destructive" aria-hidden="true" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-destructive">
            Paiement interrompu
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Le paiement n’a pas abouti
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            {state.error ??
              "Une erreur est survenue lors de l’initiation. Aucun accès n’a été activé."}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Réessayer
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/souscriptions")}
            >
              Mes transactions
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const { product, subscription } = state;

  return (
    <main className="ronet-grid min-h-screen bg-background px-5 py-10 text-foreground sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <header className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
            <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Demande enregistrée
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Finalisez sur votre téléphone.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Votre paiement a été initié. Validez la demande reçue pour activer
            votre connexion Ronet.
          </p>
        </header>

        <div className="mt-10 grid gap-5 md:grid-cols-[minmax(0,1.25fr)_minmax(16rem,0.75fr)]">
          <section className="ronet-plan ronet-surface overflow-hidden p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Ticket de connexion
                </p>
                <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
              </div>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ReceiptText className="size-5" aria-hidden="true" />
              </div>
            </div>

            {product.description && (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {product.description}
              </p>
            )}

            <Separator className="my-6" />

            <dl className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-muted-foreground">Montant</dt>
                <dd className="text-lg font-semibold">
                  {formatAmount(product.price, product.currency)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-muted-foreground">Statut</dt>
                <dd className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  {subscription.status}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-muted-foreground">Référence</dt>
                <dd>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(subscription.id, "Référence")
                    }
                    className="flex items-center gap-2 rounded-lg px-2 py-1 font-mono text-xs font-semibold transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Copier la référence complète"
                  >
                    {subscription.id.slice(0, 12)}…
                    <Copy className="size-3.5" aria-hidden="true" />
                  </button>
                </dd>
              </div>
            </dl>
          </section>

          <section className="ronet-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Prochaines étapes
            </p>
            <ol className="mt-5 space-y-5">
              {[
                {
                  icon: Smartphone,
                  text: "Validez la demande de paiement sur votre téléphone.",
                },
                {
                  icon: Wifi,
                  text: "Connectez-vous au réseau Wi-Fi du site.",
                },
                {
                  icon: Check,
                  text: "Utilisez votre code d’accès pour commencer à naviguer.",
                },
              ].map(({ icon: Icon, text }, index) => (
                <li key={text} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Étape {index + 1}
                    </span>
                    <p className="mt-0.5 text-sm leading-5">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button onClick={() => navigate("/souscriptions")} size="lg">
            <Wifi className="size-4" aria-hidden="true" />
            Suivre ma transaction
          </Button>
          <Button
            variant="outline"
            size="lg"
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
