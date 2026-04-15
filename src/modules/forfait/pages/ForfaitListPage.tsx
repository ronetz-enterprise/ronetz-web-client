import React from 'react';
import { useForfaits } from '../hooks/useForfaits';

import { Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { InternetPlanCard } from '../components/card';
import { ForfaitDialog } from '../components/ForfaitDialog';

const ForfaitListPage: React.FC = () => {
  const { forfaits, loading, createForfait } = useForfaits();

  return (
    <div className="space-y-8  ">
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Forfaits</h1>
        <ForfaitDialog onCreate={createForfait} />
      </div>

      <div className="grid   grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 px-5">
        {loading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-64 animate-pulse bg-slate-100 border-none rounded-[2.5rem]" />)
        ) : forfaits.length > 0 ? (
          forfaits.map(f => (
            <InternetPlanCard 

              forfait={f}


            />
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Settings size={64} className="mx-auto text-slate-100 mb-6" />
            <p className="text-slate-500 font-bold max-w-xs mx-auto text-lg leading-snug">Votre catalogue est vide. Créez vos premiers forfaits pour commencer à vendre.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForfaitListPage;
