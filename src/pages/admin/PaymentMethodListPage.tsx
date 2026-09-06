import React from 'react';
import { usePaymentMethods } from '@/modules/payments/hooks/usePaymentMethods';
import { PaymentMethodDialog } from '@/modules/payments/components/PaymentMethodDialog';
import { DataTable } from '@/shared/components/data-table';
import { columns } from '@/modules/payments/components/paymentMethodColumns';

const PaymentMethodListPage: React.FC = () => {
  const { paymentMethods, loading, error, refresh, createPaymentMethod } = usePaymentMethods();

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Gestion Méthodes de Paiement</h1>
        <PaymentMethodDialog onCreate={createPaymentMethod} />
      </div>

      <DataTable filters={[{ columnId: "active", label: "Statut", options: [{ label: "Actif", value: true }, { label: "Inactif", value: false }] }]} columns={columns} data={paymentMethods} loading={loading} error={error} onRetry={refresh} emptyMessage="Aucune méthode de paiement configurée." emptyAction={<PaymentMethodDialog onCreate={createPaymentMethod} />} />
    </div>
  );
};

export default PaymentMethodListPage;
