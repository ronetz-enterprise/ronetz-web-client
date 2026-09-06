import React from 'react';
import { useCountries } from '@/modules/master-data/hooks/useCountries';
import { CountryDialog } from '@/modules/master-data/components/CountryDialog';
import { DataTable } from '@/shared/components/data-table';
import { getCountryColumns } from '@/modules/master-data/components/countryColumns';

const CountryListPage: React.FC = () => {
  const { countries, loading, error, refresh, createCountry, toggleCountryBlock } = useCountries();

  const columns = React.useMemo(
    () => getCountryColumns({ onToggleBlock: toggleCountryBlock }),
    [toggleCountryBlock]
  );

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Gestion des Pays</h1>
        <CountryDialog onCreate={createCountry} />
      </div>

      <DataTable filters={[{ columnId: "access", label: "Statut", options: [{ label: "Actif", value: true }, { label: "Inactif", value: false }] }]} columns={columns} data={countries} loading={loading} error={error} onRetry={refresh} emptyMessage="Aucun pays configuré." emptyAction={<CountryDialog onCreate={createCountry} />} />
    </div>
  );
};

export default CountryListPage;
