import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSouscription } from '../hooks/useSouscription';
import type { Forfait } from '@/shared/types';
import { 
  Lock, 
  ArrowLeft, 
  Loader2, 
  ShieldCheck,
  CreditCard,
  Fingerprint
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaiementPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { purchaseForfait, isProcessing } = useSouscription();
  const forfait = (location.state as { forfait: Forfait })?.forfait;

  if (!forfait) {
    return (
      <div className="text-center p-20 space-y-4">
        <p className="text-xl font-bold text-slate-400">Aucun forfait sélectionné</p>
        <Button onClick={() => navigate('/acheter')}>Retour à l'achat</Button>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      await purchaseForfait(forfait.id);
    } catch (error) {
       // Error handled by hook
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-12">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="font-black text-slate-400 hover:text-slate-900 group"
      >
        <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" /> RETOUR
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Paiement</h1>
            <p className="text-slate-500">Finalisez votre achat en toute sécurité.</p>
          </div>

          <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-6 shadow-2xl shadow-slate-900/40 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
             <div className="flex justify-between items-start relative z-10">
               <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-primary">
                 <CreditCard size={24} />
               </div>
               <ShieldCheck size={24} className="text-green-500" />
             </div>
             
             <div className="space-y-1 relative z-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">FORFAIT SÉLECTIONNÉ</p>
               <h3 className="text-2xl font-black">{forfait.nom}</h3>
               <p className="text-slate-400 font-bold">{forfait.volume} • {forfait.duree}</p>
             </div>

             <div className="pt-6 border-t border-white/10 flex justify-between items-end relative z-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">TOTAL À PAYER</span>
                <span className="text-3xl font-black text-primary">{forfait.prix} FCFA</span>
             </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
           <div className="space-y-6">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Numéro de téléphone</label>
                 <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                    <Fingerprint size={24} className="text-slate-300" />
                    <input 
                      type="text" 
                      placeholder="00 00 00 00" 
                      className="bg-transparent w-full font-black text-xl text-slate-800 placeholder:text-slate-300 focus:outline-none"
                    />
                 </div>
              </div>
           </div>

           <Button 
             onClick={handlePayment}
             disabled={isProcessing}
             className="w-full py-10 bg-primary text-white rounded-[2rem] font-black tracking-widest text-xl shadow-2xl shadow-primary/30 hover:opacity-90 disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
           >
             {isProcessing ? <Loader2 className="animate-spin mr-3 h-6 w-6" /> : <Lock className="mr-3 h-6 w-6" />}
             {isProcessing ? 'TRAITEMENT...' : 'VALIDER L\'ACHAT'}
           </Button>

           <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest px-4 leading-relaxed">
             En cliquant, vous acceptez nos conditions générales de vente.
           </p>
        </div>
      </div>
    </div>
  );
};

export default PaiementPage;
