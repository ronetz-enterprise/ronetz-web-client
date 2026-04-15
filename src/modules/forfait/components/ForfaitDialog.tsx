import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import type { Forfait } from '@/shared/types';
import { useSites } from '@/modules/site/hooks/useSites';

interface ForfaitDialogProps {
  onCreate: (forfait: Partial<Forfait>) => Promise<void>;
}

export function ForfaitDialog({ onCreate }: ForfaitDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sites } = useSites();
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    duree: '',
    maxDevices: '',
    volume: '',
    siteId: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onCreate({
      ...formData,
      prix: Number(formData.prix),
      duree: Number(formData.duree),
      maxDevices: Number(formData.maxDevices),
    });
    setLoading(false);
    setOpen(false);
    setFormData({
      nom: '',
      prix: '',
      duree: '',
      maxDevices: '',
      volume: '',
      siteId: '',
      isActive: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hover:bg-primary-hover">
          <Plus className="mr-2 h-5 w-5" /> Nouveau Forfait
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau forfait</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du forfait</Label>
            <Input 
              id="nom" 
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prix">Prix (FCFA)</Label>
              <Input 
                id="prix" 
                type="number"
                value={formData.prix}
                onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duree">Durée (heures)</Label>
              <Input 
                id="duree" 
                type="number"
                value={formData.duree}
                onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="volume">Volume (ex: Illimité, 2Go)</Label>
              <Input 
                id="volume" 
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDevices">Appareils max</Label>
              <Input 
                id="maxDevices"
                type="number" 
                value={formData.maxDevices}
                onChange={(e) => setFormData({ ...formData, maxDevices: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteId">Site rattaché (Optionnel)</Label>
            <select
              id="siteId"
              value={formData.siteId}
              onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Tous les sites</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.nom}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={loading} className="w-full mt-6">
            {loading ? <Loader2 className="mr-2 animate-spin h-5 w-5" /> : null}
            Enregistrer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
