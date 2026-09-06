import React from 'react';
import { MapPin, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import type { Site } from '../types';

interface SiteCardProps {
  site: Site;
  onEdit?: (site: Site) => void;
  onDelete?: (id: string) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site, onEdit, onDelete }) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="p-2 bg-muted text-muted-foreground rounded-md">
          <MapPin size={24} />
        </div>

      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground break-words">{site.name}</h3>
          <p className="text-sm text-muted-foreground break-words">{site.address}</p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">{site.id}</span>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label={`Modifier ${site.name}`}
              onClick={() => onEdit?.(site)}
              className="h-10 w-10 text-slate-400 hover:text-primary rounded-md transition-colors"
            >
              <Edit size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label={`Supprimer ${site.name}`}
              onClick={() => onDelete?.(site.id)}
              className="h-10 w-10 text-slate-400 hover:text-red-500 rounded-md transition-colors"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
