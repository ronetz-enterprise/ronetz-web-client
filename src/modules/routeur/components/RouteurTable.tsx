import React from 'react';
import { Router, Download, Edit, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Routeur } from '@/shared/types';

interface RouteurTableProps {
  routeurs: Routeur[];
  loading: boolean;
  onDownloadConfig: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (routeur: Routeur) => void;
}

export const RouteurTable: React.FC<RouteurTableProps> = ({ 
  routeurs, 
  loading, 
  onDownloadConfig, 
  onDelete,
  onEdit
}) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Routeur</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Site</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Version</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-8 py-8"><div className="h-4 bg-slate-100 rounded-full w-full"></div></td>
                </tr>
              ))
            ) : routeurs.length > 0 ? (
              routeurs.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors duration-200 group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                        <Router size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{r.nom}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{r.identifiant}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-slate-600">{r.siteNom || 'Non assigné'}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {r.statut === 'ONLINE' ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                          <CheckCircle2 size={12} />
                          <span className="text-[10px] font-black uppercase tracking-widest">En ligne</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
                          <AlertCircle size={12} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Hors ligne</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest">{r.version}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDownloadConfig(r.id, r.nom)}
                        className="h-10 w-10 text-slate-400 hover:text-primary rounded-xl hover:bg-slate-50"
                      >
                        <Download size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit?.(r)}
                        className="h-10 w-10 text-slate-400 hover:text-slate-600 rounded-xl"
                      >
                        <Edit size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(r.id)}
                        className="h-10 w-10 text-slate-400 hover:text-red-500 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Router size={48} className="mx-auto text-slate-100 mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun routeur détecté</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
