import React from 'react';
import { useRouteurs } from '../hooks/useRouteurs';
import { RouteurTable } from '../components/RouteurTable';
import { RouteurDialog } from '../components/RouteurDialog';
import { Wifi } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTopologyStore } from "@/shared/store/topologyStore";
import { RouteurPage } from '../components/RouteurPage';

const RouteurListPage: React.FC = () => {
  const {
    routeurs,
    loading,
    createRouteur,
    downloadConfig,
    deleteRouteur,
    activateRouteur,
    rotateSecrets,
  } = useRouteurs();
  const { activeSiteId } = useTopologyStore();
  console.log("page en cours");
  console.log(routeurs);

  return (
    <div>
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Infrastructure WiFi</h1>
        <RouteurDialog onCreate={createRouteur} />
      </div>

      <div className="">
        {loading ? (
          [1, 2, 3].map(i => (
            <Card key={i} className="h-16 mb-2 animate-pulse bg-slate-100 border-none rounded-2xl" />
          ))
        ) : activeSiteId ? (
          <div className="p-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 space-y-4">
            <Wifi size={64} className="mx-auto text-slate-100" />
            <p className="text-slate-500 font-bold">Sélectionnez un site pour afficher ses routeurs.</p>
          </div>
        ) : routeurs.length > 0 ? (
          <RouteurPage
            routeurs={routeurs}
            onDownloadConfig={downloadConfig}
            onDelete={deleteRouteur}
            onActivate={activateRouteur}
            onRotateSecrets={rotateSecrets}
          />
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
