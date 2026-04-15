import React from 'react';
import { useAuthStore } from '@/shared/store/authStore';
import { User, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Mon Profil</h1>
        <p className="text-lg text-slate-500 font-medium">Gérez vos informations personnelles et votre sécurité.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 text-center space-y-6">
            <div className="w-32 h-32 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black mx-auto shadow-2xl shadow-slate-900/20">
              {user.nom[0]}{user.prenom[0]}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{user.prenom} {user.nom}</h2>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">
                {user.role}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent">
                  <User size={20} className="text-slate-400" />
                  <span className="font-bold text-slate-700">{user.prenom} {user.nom}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent">
                  <Mail size={20} className="text-slate-400" />
                  <span className="font-bold text-slate-700">{user.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent">
                  <Phone size={20} className="text-slate-400" />
                  <span className="font-bold text-slate-700">{user.telephone || 'Non renseigné'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Statut du compte</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent">
                  <ShieldCheck size={20} className="text-green-500" />
                  <span className="font-bold text-green-600 uppercase text-xs tracking-widest">{user.statut}</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 flex justify-end gap-4">
               <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold border-slate-200">MODIFIER</Button>
               <Button className="h-14 px-8 rounded-2xl font-black bg-slate-900 hover:bg-slate-800">SÉCURITÉ</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
