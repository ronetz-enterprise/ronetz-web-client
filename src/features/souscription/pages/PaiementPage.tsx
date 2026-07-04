import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { souscriptionApi } from '@/core/api/endpoints/souscriptionApi';
import { paymentApi } from '@/core/api/endpoints/paymentApi';
import { paymentMethodApi } from '@/core/api/endpoints/paymentMethodApi';
import type { Forfait, PaymentMethod } from '@/shared/types';
import { formatAmount, formatData, formatDuration } from '@/shared/types';
import { ArrowLeft, CreditCard, Clock, Database, Smartphone, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuthStore } from '@/shared/store/authStore';
import { usePaymentStepper } from '../hooks/usePaiemetStepper';
import { MethodStep } from '../components/methodStep';
import { PhoneStep } from '../components/phoneStep';
import { StepIndicator } from '../components/stepIndicator';
import { StepTransition } from '../components/stepTransition';

interface LocationState {
  product: Forfait;
  siteId: string;
}

const isValidPhone = (p: string) => /^[0-9]{8,15}$/.test(p.trim());
const toE164 = (p: string, countryCode = '237') => `+${countryCode}${p.replace(/\s/g, '').trim()}`;

const PaiementPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const user = useAuthStore((s) => s.user);
  const { currentStep, goToNextStep, goToPreviousStep, isFirstStep } = usePaymentStepper();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [phone, setPhone] = useState('');
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const countryCode = user?.countryCode ?? 'CM';
    paymentMethodApi.getByCountry(countryCode)
      .then(setMethods)
      .catch(() => toast.error('Impossible de charger les méthodes de paiement'))
      .finally(() => setMethodsLoading(false));
  }, [user?.countryCode]);

  if (!state?.product || !state?.siteId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-10">
        <p className="text-sm text-muted-foreground">Aucun forfait sélectionné</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Retour</Button>
      </div>
    );
  }

  const { product, siteId } = state;
  const selectedMethodObj = methods.find(m => m.code === selectedMethod);

  const canGoNext = () => {
    if (currentStep === 'method') return !!selectedMethod;
    if (currentStep === 'phone') return isValidPhone(phone);
    return false;
  };

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const { data: subscription } = await souscriptionApi.create({ productId: product.id, siteId });
      const { data: payment } = await paymentApi.initiate({
        subscriptionId: subscription.id,
        amount: product.price,
        currency: product.currency,
        paymentMethodCode: selectedMethod,
        phoneE164: toE164(phone),
        email: user?.email ?? '',
        fullName: [user?.firstName, user?.lastName].filter(Boolean).join(' '),
      });

      if (payment.paymentLink) {
        window.location.assign(payment.paymentLink);
      } else {
        navigate('/confirmation', { replace: true, state: { success: true, product, subscription } });
      }
    } catch {
      navigate('/confirmation', { replace: true, state: { success: false } });
    }
  };

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-6 z-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center space-y-1">
          <p className="font-medium">Traitement en cours</p>
          <p className="text-sm text-muted-foreground">Veuillez patienter pendant l'initiation du paiement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-background sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => isFirstStep ? navigate(-1) : goToPreviousStep()}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <StepIndicator currentStep={currentStep} />
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Forfait summary */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Forfait sélectionné
          </p>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold truncate">{product.name}</p>
              {product.description && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{product.description}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-primary">
                {new Intl.NumberFormat('fr-FR').format(product.price)}
              </p>
              <p className="text-xs text-muted-foreground uppercase">{product.currency}</p>
            </div>
          </div>
          <Separator />
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 shrink-0" />
              {formatDuration(product.durationMinutes)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Database className="h-3 w-3 shrink-0" />
              {formatData(product.dataVolumeMb)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Smartphone className="h-3 w-3 shrink-0" />
              {product.maxConcurrentDevices} app.
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1">
          <StepTransition currentStep={currentStep}>
            {currentStep === 'method' && (
              <MethodStep
                selectedProvider={selectedMethod}
                onProviderChange={setSelectedMethod}
                methods={methods}
                isLoading={methodsLoading}
              />
            )}
            {currentStep === 'phone' && (
              <PhoneStep
                phone={phone}
                onPhoneChange={setPhone}
                providerName={selectedMethodObj?.name ?? selectedMethod}
              />
            )}
            {currentStep === 'confirmation' && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">Confirmer le paiement</h2>
                  <p className="text-sm text-muted-foreground">Vérifiez les informations avant de procéder</p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Forfait', value: product.name },
                    { label: 'Méthode', value: selectedMethodObj?.name ?? selectedMethod },
                    { label: 'Numéro', value: toE164(phone) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-lg border bg-muted/30">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-sm text-muted-foreground flex-1">{label}</span>
                      <span className="text-sm font-medium truncate max-w-40">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-4 rounded-lg border border-primary/20 bg-primary/5">
                    <span className="font-medium text-sm">Total à payer</span>
                    <span className="text-lg font-bold text-primary">
                      {formatAmount(product.price, product.currency)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </StepTransition>
        </div>

        {/* Action */}
        <div className="pb-4">
          {currentStep !== 'confirmation' ? (
            <Button onClick={goToNextStep} disabled={!canGoNext()} className="w-full">
              Suivant
            </Button>
          ) : (
            <Button onClick={handlePay} className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Payer {formatAmount(product.price, product.currency)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaiementPage;
