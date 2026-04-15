import React from 'react';
import { MapPin, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import type { Site } from '@/shared/types';

interface SiteCardProps {
  site: Site;
  onEdit?: (site: Site) => void;
  onDelete?: (id: string) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site, onEdit, onDelete }) => {
  return (
    <Card className="group relative overflow-hidden bg-white rounded-[2rem] border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
          <MapPin size={24} />
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical size={20} className="text-slate-400" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{site.nom}</h3>
          <p className="text-sm font-medium text-slate-500">{site.adresse}</p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{site.domaine}</span>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit?.(site)}
              className="h-8 w-8 text-slate-400 hover:text-primary rounded-full transition-colors"
            >
              <Edit size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete?.(site.id)}
              className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-full transition-colors"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
