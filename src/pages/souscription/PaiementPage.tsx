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

const normalizePhone = (phone: string) => phone.replace(/\D/g, "");
const isValidPhone = (phone: string) => /^[0-9]{8,15}$/.test(normalizePhone(phone));
const toE164 = (phone: string, countryCode = "237") =>
  "+" + countryCode + normalizePhone(phone);

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
    paymentMethodApi
      .getByCountry(user?.countryCode ?? "CM")
      .then(setMethods)
      .catch(() => toast.error("Impossible de charger les moyens de paiement"))
      .finally(() => setMethodsLoading(false));
  }, [user?.countryCode]);

  if (!state?.product || !state?.siteId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center">
          <Wifi className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
          <h1 className="mt-4 text-lg font-semibold">Aucun forfait sélectionné</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Revenez aux offres pour choisir votre accès internet.
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
  const selectedMethodObj = methods.find((method) => method.code === selectedMethod);
  const canContinue =
    (currentStep === "method" && Boolean(selectedMethod)) ||
    (currentStep === "phone" && isValidPhone(phone));

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
      navigate("/confirmation", { replace: true, state: { success: false } });
    }
  };

  if (isProcessing) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 text-center"
        aria-live="polite"
      >
        <Loader2 className="size-7 animate-spin text-primary" aria-hidden="true" />
        <h1 className="mt-5 text-lg font-semibold">Confirmez sur votre téléphone</h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          La demande Mobile Money est en cours d’envoi. Gardez cette page ouverte.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground sm:pb-0">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (isFirstStep ? navigate(-1) : goToPreviousStep())}
            aria-label="Revenir à l’étape précédente"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Button>
          <StepIndicator currentStep={currentStep} />
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Sécurisé
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section className="min-w-0 rounded-lg border border-border bg-card p-5 sm:p-7">
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
                <h1 className="text-xl font-semibold tracking-tight">
                  Vérifier la commande
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Contrôlez ces informations avant de lancer le paiement.
                </p>
                <dl className="mt-6 divide-y rounded-lg border border-border">
                  {[
                    { label: "Forfait", value: product.name },
                    { label: "Moyen", value: selectedMethodObj?.name ?? selectedMethod },
                    { label: "Téléphone", value: toE164(phone) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-4 px-4 py-3">
                      <Check className="size-3.5 text-primary" aria-hidden="true" />
                      <dt className="flex-1 text-sm text-muted-foreground">{label}</dt>
                      <dd className="max-w-48 truncate text-sm font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </StepTransition>

          <div className="mt-8 hidden border-t border-border pt-5 sm:block">
            <CheckoutAction
              confirmation={currentStep === "confirmation"}
              disabled={!canContinue}
              amount={formatAmount(product.price, product.currency)}
              onContinue={goToNextStep}
              onPay={handlePay}
            />
          </div>
        </section>

        <aside>
          <div className="rounded-lg border border-border bg-card p-5 lg:sticky lg:top-24">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Forfait choisi</p>
                <h2 className="mt-1 text-base font-semibold">{product.name}</h2>
              </div>
              <p className="shrink-0 text-base font-semibold">
                {formatAmount(product.price, product.currency)}
              </p>
            </div>

            <dl className="mt-5 space-y-3 border-t border-border pt-4">
              <SummaryRow icon={Clock3} label="Durée" value={formatDuration(product.durationMinutes)} />
              <SummaryRow icon={Database} label="Données" value={formatData(product.dataVolumeMb)} />
              <SummaryRow icon={Smartphone} label="Appareils" value={String(product.maxConcurrentDevices)} />
            </dl>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-semibold">
                {formatAmount(product.price, product.currency)}
              </span>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 p-4 backdrop-blur sm:hidden">
        <CheckoutAction
          confirmation={currentStep === "confirmation"}
          disabled={!canContinue}
          amount={formatAmount(product.price, product.currency)}
          onContinue={goToNextStep}
          onPay={handlePay}
        />
      </div>
    </main>
  );
};

function CheckoutAction({
  confirmation,
  disabled,
  amount,
  onContinue,
  onPay,
}: {
  confirmation: boolean;
  disabled: boolean;
  amount: string;
  onContinue: () => void;
  onPay: () => void;
}) {
  return confirmation ? (
    <Button onClick={onPay} size="lg" className="w-full sm:w-auto">
      <CreditCard className="size-4" aria-hidden="true" />
      Payer {amount}
    </Button>
  ) : (
    <Button onClick={onContinue} disabled={disabled} size="lg" className="w-full sm:w-auto sm:min-w-40">
      Continuer
    </Button>
  );
}

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
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

export default PaiementPage;
