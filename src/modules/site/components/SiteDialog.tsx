import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import type { Site } from '@/shared/types';

interface SiteDialogProps {
  onCreate: (site: Partial<Site>) => Promise<void>;
}

export function SiteDialog({ onCreate }: SiteDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nom: '', adresse: '', domaine: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onCreate(formData);
    setLoading(false);
    setOpen(false);
    setFormData({ nom: '', adresse: '', domaine: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hover:bg-primary-hover">
          <Plus className="mr-2 h-5 w-5" /> Nouveau Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau site</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du site</Label>
            <Input 
              id="nom" 
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input 
              id="adresse" 
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domaine">Domaine</Label>
            <Input 
              id="domaine" 
              value={formData.domaine}
              onChange={(e) => setFormData({ ...formData, domaine: e.target.value })}
              required
            />
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
