import React, { useEffect } from 'react';
import { useJetons } from '../hooks/useSouscription';
import { JetonCard } from '../components/JetonCard';
import { 
  Ticket, 
  History, 
  ShieldCheck,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const JetonsPage: React.FC = () => {
  const { activeJetons, historique, loading, refresh } = useJetons();

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Mes Accès WiFi</h1>
        <div className="flex items-center gap-3">
           <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm w-48 lg:w-64"
              />
           </div>
        </div>
      </div>

      <div className="px-5">
        <Tabs defaultValue="actifs" className="space-y-6">
          <TabsList className="bg-slate-100 p-1 rounded-lg inline-flex h-auto w-full md:w-auto">
            <TabsTrigger value="actifs" className="rounded-md px-8 py-2 font-medium text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all flex items-center gap-2">
               <ShieldCheck size={16} /> Actifs
            </TabsTrigger>
            <TabsTrigger value="historique" className="rounded-md px-8 py-2 font-medium text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all flex items-center gap-2">
               <History size={16} /> Historique
            </TabsTrigger>
          </TabsList>

        <TabsContent value="actifs" className="mt-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <Card key={i} className="h-80 bg-slate-50 animate-pulse rounded-[2.5rem] border-none" />)
            ) : activeJetons.length > 0 ? (
              activeJetons.map(j => <JetonCard key={j.id} jeton={j} />)
            ) : (
              <div className="col-span-full py-32 text-center space-y-6">
                 <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200 rotate-12">
                   <Ticket size={48} />
                 </div>
                 <div className="space-y-2">
                    <p className="text-2xl font-black text-slate-300 tracking-tight uppercase">Aucun jeton actif</p>
                    <p className="text-slate-400 font-medium">Achetez un forfait pour commencer à naviguer.</p>
                 </div>
                 <Button className="rounded-2xl font-black px-8 py-6 h-auto">ACHETER MAINTENANT</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="historique" className="mt-0 outline-none">
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <Card key={i} className="h-80 bg-slate-50 animate-pulse rounded-[2.5rem] border-none" />)
            ) : historique.length > 0 ? (
              historique.map(j => <JetonCard key={j.id} jeton={j} isHistory />)
            ) : (
               <div className="col-span-full py-32 text-center opacity-30 grayscale">
                  <History size={80} className="mx-auto text-slate-300 mb-6" />
                  <p className="text-2xl font-black text-slate-400 uppercase tracking-tighter">Votre historique est vide</p>
               </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default JetonsPage;
