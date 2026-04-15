import React, { useState } from 'react';
import { MapPin, Clock, Database, Eye, EyeOff, Copy, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Jeton } from '@/shared/types';
import { toast } from 'sonner';

interface JetonCardProps {
  jeton: Jeton;
  isHistory?: boolean;
}

export const JetonCard: React.FC<JetonCardProps> = ({ jeton, isHistory = false }) => {
  const [showPin, setShowPin] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  const isActive = jeton.statut === 'ACTIF';

  return (
    <div
      className={cn(
        "group relative w-full max-w-[340px] aspect-[1.586] rounded-2xl p-6",
        "overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        "text-white",
        isActive
          ? "bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-700"
          : "bg-gradient-to-br from-zinc-700 to-zinc-800 opacity-80"
      )}
    >
      {/* Glow premium */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Halo */}
      <div className="pointer-events-none absolute -right-20 -top-1/2 h-[300px] w-[300px] rounded-full bg-white/10 blur-2xl" />

      {/* Wifi */}
      <Wifi className="absolute right-6 top-6 h-6 w-6 opacity-50" />

      {/* HEADER */}
      <div className="mb-5 flex items-start justify-between">
        <div className="h-8 w-[42px] rounded-md bg-gradient-to-br from-amber-300 to-amber-500 shadow-inner" />

        <div className="flex flex-col items-end gap-1">
          <span className="text-lg font-bold tracking-wide">IBBL</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
              isActive ? "bg-green-500/30" : "bg-white/20"
            )}
          >
            {jeton.statut}
          </span>
        </div>
      </div>

      {/* CODE */}
      <div className="mb-4 font-mono text-[20px] tracking-[3px] font-semibold text-white/95">
        {jeton.code}
      </div>

      {/* PIN - version améliorée */}
      {!isHistory && (
        <div className="mb-4 rounded-xl bg-black/30 backdrop-blur-lg border border-white/10 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/60 mb-1">PIN</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg tracking-[4px]">
                  {showPin ? jeton.pin : '••••'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowPin(!showPin)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              <button
                onClick={() => copyToClipboard(jeton.pin, 'PIN')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-end justify-between text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/80">
            <Clock className="w-3 h-3" />
            <span>{jeton.dateExpiration}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Database className="w-3 h-3" />
            <span>{jeton.volumeRestant}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/15">
          <MapPin className="w-3 h-3" />
          <span className="text-xs">{jeton.siteNom}</span>
        </div>
      </div>
    </div>
  );
};