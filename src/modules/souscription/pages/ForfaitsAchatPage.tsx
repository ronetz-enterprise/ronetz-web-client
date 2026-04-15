import React, { useState, useEffect } from 'react';
import { useSites } from '@/modules/site/hooks/useSites';
import { useForfaits } from '@/modules/forfait/hooks/useForfaits';
import { ForfaitCard } from '@/modules/forfait/components/ForfaitCard';
import { MapPin, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const ForfaitsAchatPage: React.FC = () => {
  const { sites } = useSites();
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const { forfaits, loading, refresh: fetchForfaits } = useForfaits();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedSiteId) {
      fetchForfaits(selectedSiteId);
    }
  }, [selectedSiteId, fetchForfaits]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 border-b py-3 gap-4">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Achat de Forfait</h1>
      </div>

      <div className="px-5 space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 max-w-md">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <MapPin size={16} className="text-primary" /> Sélectionner un site
          </label>
          <select 
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 text-sm cursor-pointer"
          >
            <option value="">Choisir un emplacement...</option>
            {sites.map(site => <option key={site.id} value={site.id}>{site.nom}</option>)}
          </select>
        </div>

      {selectedSiteId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {loading ? (
             [1, 2, 3].map(i => <Card key={i} className="h-96 bg-slate-100 animate-pulse rounded-[3rem] border-none" />)
          ) : forfaits.length > 0 ? (
            forfaits.map(f => (
              <ForfaitCard 
                key={f.id} 
                forfait={f} 
                variant="client"
                onSelect={(forf) => navigate('/paiement', { state: { forfait: forf } })}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-6">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                 <Info size={40} />
               </div>
               <p className="text-slate-400 font-bold text-xl">Aucun forfait disponible pour ce site.</p>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default ForfaitsAchatPage;
