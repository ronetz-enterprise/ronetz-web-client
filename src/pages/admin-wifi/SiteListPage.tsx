import React from 'react';
import { useSites } from '@/modules/network-ops/hooks/useSites';
import { MapPin } from 'lucide-react';
import SitePage from '@/modules/network-ops/components/SiteTable';
import { SiteDialog } from '@/modules/network-ops/components/SiteDialog';

const SiteListPage: React.FC = () => {
  const { sites, loading, createSite } = useSites();

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Gestion des Sites</h1>
        </div>
        <SiteDialog onCreate={createSite} />
      </div>

      <div className="p-6  ">
        {loading || sites.length > 0 ? (
          <SitePage sites={sites} loading={loading} />
        ) : (
          <div className="py-20 text-center space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-border mx-auto">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Aucun site pour ce domaine.</p>
            <SiteDialog onCreate={createSite} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteListPage;
