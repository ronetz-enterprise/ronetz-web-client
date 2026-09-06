import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InternetPlanCard } from './InternetPlanCard';
import type { Forfait } from '../types';

interface ForfaitCardProps {
  forfait: Forfait;
  onEdit?: (forfait: Forfait) => void;
  onDelete?: (id: string) => void;
  onSelect?: (forfait: Forfait) => void;
  variant?: 'admin' | 'client';
}

export const ForfaitCard: React.FC<ForfaitCardProps> = ({ forfait, onEdit, onDelete, onSelect, variant = 'admin' }) => (
  <div className="flex h-full min-w-0 flex-col rounded-lg border border-(--card-border) shadow-(--card-shadow) bg-card text-card-foreground">
    <InternetPlanCard forfait={forfait} className="flex-1 border-0 rounded-b-none shadow-none" />
    <div className="flex items-center justify-end gap-2 border-t p-3">
      {variant === 'client' ? (
        <Button className="min-h-10 w-full" onClick={() => onSelect?.(forfait)}>Choisir ce forfait</Button>
      ) : (
        <>
          <Button variant="outline" className="min-h-10" onClick={() => onEdit?.(forfait)}><Edit className="size-4" />Modifier</Button>
          <Button variant="ghost" size="icon" className="size-10 text-destructive" aria-label={`Supprimer ${forfait.name}`} onClick={() => onDelete?.(forfait.id)}><Trash2 className="size-4" /></Button>
        </>
      )}
    </div>
  </div>
);
