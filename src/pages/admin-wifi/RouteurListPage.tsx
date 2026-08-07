import React from 'react';
import { useRouteurs } from '@/modules/network-ops/hooks/useRouteurs';
import { RouteurDialog } from '@/modules/network-ops/components/RouteurDialog';
import { Wifi } from 'lucide-react';
import { useTopologyStore } from "@/modules/network-ops/store/topologyStore";
import { RouteurPage } from '@/modules/network-ops/components/RouteurPage';

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

  return (
    <div>
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Infrastructure WiFi</h1>
        <RouteurDialog onCreate={createRouteur} />
      </div>

      <div className="p-6">
        {activeSiteId ? (
          <div className="p-20 text-center bg-card rounded-lg border border-dashed border-border space-y-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-border mx-auto">
              <Wifi className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-bold">Sélectionnez un site pour afficher ses routeurs.</p>
          </div>
        ) : loading || routeurs.length > 0 ? (
          <RouteurPage
            routeurs={routeurs}
            loading={loading}
            onDownloadConfig={downloadConfig}
            onDelete={deleteRouteur}
            onActivate={activateRouteur}
            onRotateSecrets={rotateSecrets}
          />
        ) : (
          <div className="p-20 text-center bg-card rounded-lg border border-dashed border-border space-y-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-border mx-auto">
              <Wifi className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-bold">Aucun routeur configuré. Commencez par en ajouter un.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteurListPage;
