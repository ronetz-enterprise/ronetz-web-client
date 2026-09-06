import React from "react";
import { ArrowLeft, Info, LockKeyhole } from "lucide-react";
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
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-5"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour
          </Button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Choisir un forfait
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Comparez les offres disponibles et sélectionnez celle qui vous convient.
              </p>
            </div>
            <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <LockKeyhole className="size-3.5" aria-hidden="true" />
              Paiement sécurisé
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {siteId ? (
          <>
            {!loading && forfaits.length > 0 && (
              <p className="mb-5 text-sm text-muted-foreground">
                {forfaits.length} forfait{forfaits.length > 1 ? "s" : ""} disponible
                {forfaits.length > 1 ? "s" : ""}
              </p>
            )}

            <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                [1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-60 rounded-lg" />
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
    <div className="col-span-full mx-auto w-full max-w-lg rounded-lg border border-border bg-card px-6 py-12 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Info className="size-4" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-semibold">Connexion indisponible</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
    </div>
  );
}

export default ForfaitsAchatPage;
