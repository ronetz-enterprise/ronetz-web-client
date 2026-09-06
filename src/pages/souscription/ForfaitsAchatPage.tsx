import React from "react";
import { ArrowLeft, Info, ShieldCheck, Sparkles, Wifi } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InternetPlanCard } from "@/modules/commerce/components/InternetPlanCard";
import { useForfaits } from "@/modules/commerce/hooks/useForfaits";

const ForfaitsAchatPage: React.FC = () => {
  const { siteId } = useParams();
  const { forfaits, loading } = useForfaits(siteId ?? null);
  const navigate = useNavigate();

  return (
    <main className="ronet-grid min-h-[calc(100vh-4rem)]">
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour
          </Button>

          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Connexion simple, activation immédiate
              </div>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                Choisissez votre accès internet.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                Comparez les durées et volumes disponibles, puis payez en toute sécurité.
                Votre accès sera généré dès la confirmation.
              </p>
            </div>

            <div className="ronet-surface flex items-start gap-3 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="size-4.5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Paiement protégé</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Vos informations sont utilisées uniquement pour finaliser cet achat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {siteId ? (
          <>
            {!loading && forfaits.length > 0 && (
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {forfaits.length} forfait{forfaits.length > 1 ? "s" : ""} disponible{forfaits.length > 1 ? "s" : ""}
                </p>
                <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:flex">
                  <Wifi className="size-4 text-primary" aria-hidden="true" />
                  Réseau du site détecté
                </div>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {loading ? (
                [1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-[29rem] rounded-[1.35rem]" />
                ))
              ) : forfaits.length > 0 ? (
                forfaits.map((forfait) => (
                  <InternetPlanCard
                    key={forfait.id}
                    forfait={forfait}
                    onSelect={(product) =>
                      navigate("/paiement", { state: { product, siteId } })
                    }
                  />
                ))
              ) : (
                <EmptyState message="Aucun forfait n’est disponible pour ce site pour le moment." />
              )}
            </div>
          </>
        ) : (
          <EmptyState message="Aucun site n’a été identifié. Revenez au portail du réseau puis réessayez." />
        )}
      </section>
    </main>
  );
};

function EmptyState({ message }: { message: string }) {
  return (
    <div className="ronet-surface col-span-full mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Info className="size-5" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-foreground">Connexion indisponible</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
    </div>
  );
}

export default ForfaitsAchatPage;
