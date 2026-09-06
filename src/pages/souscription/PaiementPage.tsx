import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Clock3,
  CreditCard,
  Database,
  Loader2,
  LockKeyhole,
  Smartphone,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { souscriptionApi } from "@/modules/commerce/api/souscriptionApi";
import { StepIndicator } from "@/modules/commerce/components/stepIndicator";
import { StepTransition } from "@/modules/commerce/components/stepTransition";
import type { Forfait } from "@/modules/commerce/types";
import { paymentApi } from "@/modules/payments/api/paymentApi";
import { MethodStep } from "@/modules/payments/components/methodStep";
import { PhoneStep } from "@/modules/payments/components/phoneStep";
import { usePaymentStepper } from "@/modules/payments/hooks/usePaiemetStepper";
import { paymentMethodApi } from "@/modules/payments/api/paymentMethodApi";
import type { PaymentMethod } from "@/modules/payments/types";
import { formatAmount, formatData, formatDuration } from "@/shared/lib/format";

interface LocationState {
  product: Forfait;
  siteId: string;
}

const isValidPhone = (phone: string) => /^[0-9]{8,15}$/.test(phone.trim());
const toE164 = (phone: string, countryCode = "237") =>
  "+" + countryCode + phone.replace(/\s/g, "").trim();

const PaiementPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const user = useAuthStore((store) => store.user);
  const { currentStep, goToNextStep, goToPreviousStep, isFirstStep } =
    usePaymentStepper();

  const [selectedMethod, setSelectedMethod] = useState("");
  const [phone, setPhone] = useState("");
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const countryCode = user?.countryCode ?? "CM";
    paymentMethodApi
      .getByCountry(countryCode)
      .then(setMethods)
      .catch(() => toast.error("Impossible de charger les méthodes de paiement"))
      .finally(() => setMethodsLoading(false));
  }, [user?.countryCode]);

  if (!state?.product || !state?.siteId) {
    return (
      <main className="ronet-grid flex min-h-screen items-center justify-center p-6">
        <div className="ronet-surface max-w-md p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Wifi className="size-5" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-xl font-semibold">Aucun forfait sélectionné</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Revenez à la liste des offres pour choisir votre accès internet.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour aux forfaits
          </Button>
        </div>
      </main>
    );
  }

  const { product, siteId } = state;
  const selectedMethodObj = methods.find(
    (method) => method.code === selectedMethod
  );

  const canGoNext = () => {
    if (currentStep === "method") return Boolean(selectedMethod);
    if (currentStep === "phone") return isValidPhone(phone);
    return false;
  };

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const { data: subscription } = await souscriptionApi.create({
        productId: product.id,
        siteId,
      });
      const { data: payment } = await paymentApi.initiate({
        subscriptionId: subscription.id,
        amount: product.price,
        currency: product.currency,
        paymentMethodCode: selectedMethod,
        phoneE164: toE164(phone),
        email: user?.email ?? "",
        fullName: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
      });

      if (payment.paymentLink) {
        window.location.assign(payment.paymentLink);
      } else {
        navigate("/confirmation", {
          replace: true,
          state: { success: true, product, subscription },
        });
      }
    } catch {
      navigate("/confirmation", {
        replace: true,
        state: { success: false },
      });
    }
  };

  if (isProcessing) {
    return (
      <div
        className="ronet-grid fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background p-6 text-foreground"
        aria-live="polite"
      >
        <div className="relative flex size-20 items-center justify-center rounded-full border border-primary/15 bg-primary/10">
          <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
        </div>
        <div className="max-w-sm text-center">
          <p className="text-lg font-semibold">Traitement sécurisé en cours</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Gardez cette page ouverte pendant l’initiation du paiement.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="ronet-grid min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (isFirstStep ? navigate(-1) : goToPreviousStep())}
            aria-label="Revenir à l’étape précédente"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Button>
          <div className="min-w-0 flex-1">
            <StepIndicator currentStep={currentStep} />
          </div>
          <div className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground sm:flex">
            <LockKeyhole className="size-4 text-primary" aria-hidden="true" />
            Paiement sécurisé
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:py-12">
        <section className="ronet-surface order-2 min-w-0 p-5 sm:p-7 lg:order-1">
          <StepTransition currentStep={currentStep}>
            {currentStep === "method" && (
              <MethodStep
                selectedProvider={selectedMethod}
                onProviderChange={setSelectedMethod}
                methods={methods}
                isLoading={methodsLoading}
              />
            )}

            {currentStep === "phone" && (
              <PhoneStep
                phone={phone}
                onPhoneChange={setPhone}
                providerName={selectedMethodObj?.name ?? selectedMethod}
              />
            )}

            {currentStep === "confirmation" && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Dernière étape
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                  Vérifiez votre paiement
                </h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Confirmez les informations avant de générer votre accès.
                </p>

                <div className="mt-7 space-y-3">
                  {[
                    { label: "Forfait", value: product.name },
                    {
                      label: "Méthode",
                      value: selectedMethodObj?.name ?? selectedMethod,
                    },
                    { label: "Numéro", value: toE164(phone) },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/35 px-4 py-3.5"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      <span className="flex-1 text-sm text-muted-foreground">
                        {label}
                      </span>
                      <span className="max-w-48 truncate text-sm font-semibold">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </StepTransition>

          <div className="mt-8 border-t border-border/70 pt-5">
            {currentStep !== "confirmation" ? (
              <Button
                onClick={goToNextStep}
                disabled={!canGoNext()}
                size="lg"
                className="w-full sm:w-auto sm:min-w-44"
              >
                Continuer
              </Button>
            ) : (
              <Button
                onClick={handlePay}
                size="lg"
                className="w-full sm:w-auto"
              >
                <CreditCard className="size-4" aria-hidden="true" />
                Payer {formatAmount(product.price, product.currency)}
              </Button>
            )}
          </div>
        </section>

        <aside className="order-1 lg:order-2">
          <div className="ronet-plan ronet-surface sticky top-24 overflow-hidden p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Votre forfait
            </p>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">{product.name}</h2>
                {product.description && (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {product.description}
                  </p>
                )}
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Wifi className="size-4.5" aria-hidden="true" />
              </div>
            </div>

            <Separator className="my-5" />

            <dl className="space-y-3.5">
              <SummaryRow
                icon={Clock3}
                label="Durée"
                value={formatDuration(product.durationMinutes)}
              />
              <SummaryRow
                icon={Database}
                label="Données"
                value={formatData(product.dataVolumeMb)}
              />
              <SummaryRow
                icon={Smartphone}
                label="Appareils"
                value={String(product.maxConcurrentDevices)}
              />
            </dl>

            <div className="mt-6 flex items-end justify-between gap-4 rounded-xl bg-foreground px-4 py-4 text-background">
              <span className="text-sm font-medium opacity-70">Total</span>
              <span className="text-xl font-semibold">
                {formatAmount(product.price, product.currency)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        {label}
      </dt>
      <dd className="text-sm font-semibold">{value}</dd>
    </div>
  );
}

export default PaiementPage;
