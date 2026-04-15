import React from 'react';
import { useSites } from '../hooks/useSites';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import SitePage from '../components/page';
import { SiteDialog } from '../components/SiteDialog';

const SiteListPage: React.FC = () => {
  const { sites, loading, createSite } = useSites();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-5 border-b py-3">

        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Gestion des Sites</h1>

        <SiteDialog onCreate={createSite} />
      </div>

      <div className=" gap-6 px-5">
        {loading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-48 animate-pulse bg-slate-100 border-none rounded-3xl" />)
        ) : sites.length > 0 ? (
          <SitePage />
        ) : (
          <div className="col-span-full p-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 space-y-4">
            <MapPin size={64} className="mx-auto text-slate-100" />
            <p className="text-slate-500 font-bold">Aucun site configuré. Commencez par en ajouter un.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteListPage;
