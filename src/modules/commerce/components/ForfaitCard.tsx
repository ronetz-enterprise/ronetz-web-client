import React from 'react';
import { Tag, Edit, Trash2, Clock, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Forfait } from '../types';
import { formatData, formatDuration } from '@/shared/lib/format';

interface ForfaitCardProps {
  forfait: Forfait;
  onEdit?: (forfait: Forfait) => void;
  onDelete?: (id: string) => void;
  onSelect?: (forfait: Forfait) => void;
  variant?: 'admin' | 'client';
}

export const ForfaitCard: React.FC<ForfaitCardProps> = ({
  forfait,
  onEdit,
  onDelete,
  onSelect,
  variant = 'admin',
}) => {
  if (variant === 'client') {
    return (
      <Card className="group relative bg-white rounded-[3rem] p-10 border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
        <div className="relative z-10 flex flex-col h-full space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{forfait.name}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-primary">
                {new Intl.NumberFormat("fr-FR").format(forfait.price)}
              </span>
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">
                {forfait.currency}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
              <Clock size={20} className="text-slate-400" />
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">DURÉE</p>
                <p className="text-base font-black text-slate-700">{formatDuration(forfait.durationMinutes)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
              <Database size={20} className="text-slate-400" />
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">VOLUME</p>
                <p className="text-base font-black text-slate-700">{formatData(forfait.dataVolumeMb)}</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => onSelect?.(forfait)}
            className="w-full py-8 bg-slate-900 text-white rounded-[1.5rem] font-black tracking-widest text-lg group-hover:bg-primary transition-colors duration-300"
          >
            CHOISIR
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group relative bg-white rounded-[2.5rem] p-8 border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
      <div className="relative z-10 flex flex-col h-full space-y-6">
        <div className="flex justify-between items-start">
          <div className="p-4 bg-slate-900 text-white rounded-[1.2rem] shadow-lg shadow-slate-900/10">
            <Tag size={24} />
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit?.(forfait)}
              className="h-10 w-10 text-slate-400 hover:text-primary rounded-xl hover:bg-slate-50"
            >
              <Edit size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(forfait.id)}
              className="h-10 w-10 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-50"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">{forfait.name}</h3>
          {forfait.description && (
            <p className="text-sm text-slate-500">{forfait.description}</p>
          )}
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-3xl font-black text-slate-900">
              {new Intl.NumberFormat("fr-FR").format(forfait.price)}
            </span>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {forfait.currency}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-slate-500">
            <Clock size={16} className="text-slate-400" />
            <span className="text-sm font-bold">{formatDuration(forfait.durationMinutes)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Database size={16} className="text-slate-400" />
            <span className="text-sm font-bold">{formatData(forfait.dataVolumeMb)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
