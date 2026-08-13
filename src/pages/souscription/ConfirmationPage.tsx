import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Forfait, SubscriptionDto } from '@/modules/commerce/types';
import { CheckCircle2, XCircle, ArrowLeft, Wifi, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Redirection en cours…</p>
      </div>
    );
  }

  if (!state.success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-background text-foreground">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center space-y-1.5 max-w-xs">
          <h1 className="text-xl font-semibold">Paiement échoué</h1>
          <p className="text-sm text-muted-foreground">
            {state.error ?? "Une erreur est survenue lors de l'initiation du paiement. Veuillez réessayer."}
          </p>
        </div>
        <div className="flex flex-col gap-2.5 w-full max-w-xs">
          <Button onClick={() => navigate(-1)} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          <Button variant="outline" onClick={() => navigate('/souscriptions')} className="w-full">
            Mes transactions
          </Button>
        </div>
      </div>
    );
  }

  const { product, subscription } = state;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Success icon */}
        <div className="text-center space-y-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Paiement initié</h1>
            <p className="text-sm text-muted-foreground">
              Votre demande a bien été enregistrée. Suivez les instructions sur votre téléphone pour finaliser.
            </p>
          </div>
        </div>

        {/* Forfait recap */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Détails de la commande
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{product.name}</p>
              {product.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{product.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {new Intl.NumberFormat('fr-FR').format(product.price)}
              </p>
              <p className="text-xs text-muted-foreground uppercase">{product.currency}</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Statut</span>
              <span className="font-medium capitalize">{subscription.status}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Référence</span>
              <button
                onClick={() => copyToClipboard(subscription.id, 'Référence')}
                className="flex items-center gap-1.5 font-mono font-medium text-xs hover:text-primary transition-colors"
              >
                {subscription.id.slice(0, 12)}…
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Prochaines étapes
          </p>
          <ul className="space-y-3">
            {[
              { step: '1', text: 'Validez la demande de paiement sur votre téléphone' },
              { step: '2', text: 'Connectez-vous au réseau Wi‑Fi de votre site' },
              { step: '3', text: 'Utilisez votre code de connexion pour naviguer' },
            ].map(({ step, text }) => (
              <li key={step} className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border bg-muted mt-0.5">
                  <span className="text-[10px] font-medium text-muted-foreground">{step}</span>
                </div>
                <p className="text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <Button onClick={() => navigate('/souscriptions')} className="w-full">
            <Wifi className="mr-2 h-4 w-4" />
            Mes transactions
          </Button>
          <Button variant="outline" onClick={() => navigate('/acheter/' + subscription.siteId)} className="w-full">
            Acheter un autre forfait
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
