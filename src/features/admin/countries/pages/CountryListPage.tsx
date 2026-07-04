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
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Gestion des Pays</h1>
        <CountryDialog onCreate={createCountry} />
      </div>

      <div className="">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : countries.length > 0 ? (
          <div className="bg-white  overflow-hidden">
             <DataTable columns={columns} data={countries} />
          </div>
        ) : (
          <div className="p-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 space-y-4">
            <Globe size={64} className="mx-auto text-slate-100" />
            <p className="text-slate-500 font-bold">Aucun pays configuré.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryListPage;
