import { useSites } from '@/modules/network-ops/hooks/useSites';
import { SiteDialog } from '@/modules/network-ops/components/SiteDialog';
import { columns } from '@/modules/network-ops/components/siteColumns';
import { DataTable } from '@/shared/components/data-table';

export default function SiteListPage() {
  const { sites, loading, error, refresh, createSite } = useSites();
  return <div>
    <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3"><h1 className="text-xl font-semibold">Sites</h1><SiteDialog onCreate={createSite} /></div>
    <DataTable columns={columns} data={sites} loading={loading} error={error} onRetry={refresh} emptyMessage="Aucun site n’a encore été ajouté." emptyAction={<SiteDialog onCreate={createSite} />} />
  </div>;
}
