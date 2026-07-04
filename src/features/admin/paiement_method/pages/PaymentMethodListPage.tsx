import React from 'react';
import { usePaymentMethods } from '../hook/usePaymentMethods';
import { PaymentMethodDialog } from '../components/PaymentMethodDialog';
import { DataTable } from '@/shared/components/data-table';
import { columns } from '../components/paymentMethodColumns';
import { CreditCard, Loader2 } from 'lucide-react';

const PaymentMethodListPage: React.FC = () => {
  const { paymentMethods, loading, createPaymentMethod } = usePaymentMethods();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Gestion Méthodes de Paiement</h1>
        <PaymentMethodDialog onCreate={createPaymentMethod} />
      </div>

      <div className="px-5">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : paymentMethods.length > 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <DataTable columns={columns} data={paymentMethods} />
          </div>
        ) : (
          <div className="p-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 space-y-4">
            <CreditCard size={64} className="mx-auto text-slate-100" />
            <p className="text-slate-500 font-bold">Aucune méthode de paiement configurée.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodListPage;
