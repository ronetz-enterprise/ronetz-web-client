import React from 'react';
import { usePaymentMethods } from '@/modules/payments/hooks/usePaymentMethods';
import { PaymentMethodDialog } from '@/modules/payments/components/PaymentMethodDialog';
import { DataTable } from '@/shared/components/data-table';
import { columns } from '@/modules/payments/components/paymentMethodColumns';
import { CreditCard, Loader2 } from 'lucide-react';

const PaymentMethodListPage: React.FC = () => {
  const { paymentMethods, loading, createPaymentMethod } = usePaymentMethods();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Gestion Méthodes de Paiement</h1>
        <PaymentMethodDialog onCreate={createPaymentMethod} />
      </div>

      <div className="px-5">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : paymentMethods.length > 0 ? (
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
             <DataTable columns={columns} data={paymentMethods} />
          </div>
        ) : (
          <div className="p-20 text-center bg-card rounded-lg border border-dashed border-border space-y-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-border mx-auto">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-bold">Aucune méthode de paiement configurée.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodListPage;
