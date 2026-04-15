import React from 'react';
import { useRouteurs } from '../hooks/useRouteurs';
import { RouteurPage } from '../components/RouteurPage';
import { Wifi } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RouteurDialog } from '../components/RouteurDialog';

const RouteurListPage: React.FC = () => {
  const { routeurs, loading, createRouteur } = useRouteurs();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Infrastructure WiFi</h1>
        <RouteurDialog onCreate={createRouteur} />
      </div>

      <div className="px-5">
        {loading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-16 mb-2 animate-pulse bg-slate-100 border-none rounded-2xl" />)
        ) : routeurs.length > 0 ? (
          <RouteurPage routeurs={routeurs} />
        ) : (
          <div className="p-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 space-y-4">
            <Wifi size={64} className="mx-auto text-slate-100" />
            <p className="text-slate-500 font-bold">Aucun routeur configuré. Commencez par en ajouter un.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteurListPage;
