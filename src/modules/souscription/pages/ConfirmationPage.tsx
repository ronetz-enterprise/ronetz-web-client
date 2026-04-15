import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import type { Jeton } from '@/shared/types';
import { 
  CheckCircle2, 
  ArrowRight, 
  Ticket,
  Copy,
  LayoutDashboard,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const jeton = (location.state as { jeton: Jeton })?.jeton;

  if (!jeton) {
    return <div className="text-center p-20">Redirection...</div>;
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto animate-bounce-subtle">
           <CheckCircle2 size={56} strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Paiement Réussi !</h1>
          <p className="text-lg text-slate-500">Vos identifiants de connexion sont prêts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
         <div className="space-y-8">
            <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white space-y-8 shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-primary/30 transition-colors duration-1000"></div>
               
               <div className="space-y-2 relative z-10">
                  <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                     <Globe size={14} /> IDENTIFIANTS WIFI
                  </div>
                  <h3 className="text-3xl font-black">Prêt à naviguer</h3>
               </div>

               <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">CODE UTILISATEUR</p>
                     <div className="flex items-center justify-between p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                        <span className="font-mono font-black text-2xl tracking-widest">{jeton.code}</span>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(jeton.code, 'Code')} className="text-slate-400 hover:text-white rounded-xl">
                           <Copy size={20} />
                        </Button>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">MOT DE PASSE (PIN)</p>
                     <div className="flex items-center justify-between p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                        <span className="font-mono font-black text-2xl tracking-[0.4em]">{jeton.pin}</span>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(jeton.pin, 'PIN')} className="text-slate-400 hover:text-white rounded-xl">
                           <Copy size={20} />
                        </Button>
                     </div>
                  </div>
               </div>

               <div className="pt-8 border-t border-white/5 flex gap-6 relative z-10">
                  <div className="text-center">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">VALIDITÉ</p>
                     <p className="font-bold text-sm tracking-tight">{jeton.dateExpiration}</p>
                  </div>
                  <div className="text-center">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">VOLUME</p>
                     <p className="font-bold text-sm tracking-tight">{jeton.volumeRestant}</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
               <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Prochaines Étapes</h4>
               <ul className="space-y-6">
                 {[
                   { icon: ShieldCheck, text: "Connectez-vous au réseau Rik WiFi", color: "text-blue-500", bg: "bg-blue-50" },
                   { icon: Ticket, text: "Entrez vos identifiants sur la page de connexion", color: "text-primary", bg: "bg-primary/10" },
                   { icon: LayoutDashboard, text: "Gérez vos consommations sur votre tableau de bord", color: "text-slate-400", bg: "bg-slate-50" }
                 ].map((item, i) => (
                   <li key={i} className="flex gap-4">
                      <div className={`shrink-0 w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center`}>
                        <item.icon size={20} />
                      </div>
                      <p className="text-slate-600 font-bold leading-snug self-center">{item.text}</p>
                   </li>
                 ))}
               </ul>
            </div>

            <Link to="/jetons">
               <Button className="w-full py-10 bg-slate-900 text-white rounded-[2rem] font-black tracking-widest text-xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95">
                  MES JETONS <ArrowRight className="ml-3 h-6 w-6" />
               </Button>
            </Link>
         </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
