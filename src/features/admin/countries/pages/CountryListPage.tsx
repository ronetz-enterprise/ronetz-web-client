import React from 'react';
import { useCountries } from '../hook/useCountries';
import { CountryDialog } from '../components/CountryDialog';
import { DataTable } from '@/shared/components/data-table';
import { getCountryColumns } from '../components/countryColumns';
import { Globe, Loader2 } from 'lucide-react';

const CountryListPage: React.FC = () => {
  const { countries, loading, createCountry, toggleCountryBlock } = useCountries();

  const columns = React.useMemo(
    () => getCountryColumns({ onToggleBlock: toggleCountryBlock }),
    [toggleCountryBlock]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Gestion des Pays</h1>
        <CountryDialog onCreate={createCountry} />
      </div>

      <div className="">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : countries.length > 0 ? (
          <div className="bg-card overflow-hidden">
             <DataTable columns={columns} data={countries} />
          </div>
        ) : (
          <div className="p-20 text-center bg-card rounded-lg border border-dashed border-border space-y-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-border mx-auto">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-bold">Aucun pays configuré.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryListPage;
