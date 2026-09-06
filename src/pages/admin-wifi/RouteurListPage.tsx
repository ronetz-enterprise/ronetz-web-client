import React from 'react';
import { useRouteurs } from '@/modules/network-ops/hooks/useRouteurs';
import { RouteurDialog } from '@/modules/network-ops/components/RouteurDialog';
import { useTopologyStore } from "@/modules/network-ops/store/topologyStore";
import { RouteurPage } from '@/modules/network-ops/components/RouteurPage';

const RouteurListPage: React.FC = () => {
  const {
    routeurs,
    loading, error, refresh,
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

      <RouteurPage
        routeurs={activeSiteId ? routeurs.filter((routeur) => routeur.siteId === activeSiteId) : routeurs}
        loading={loading} error={error} onRetry={refresh}
        emptyAction={<RouteurDialog onCreate={createRouteur} />}
        onDownloadConfig={downloadConfig} onDelete={deleteRouteur}
        onActivate={activateRouteur} onRotateSecrets={rotateSecrets}
      />
    </div>
  );
};

export default RouteurListPage;
