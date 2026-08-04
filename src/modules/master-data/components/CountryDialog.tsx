import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import type { Country } from '../types';

interface CountryDialogProps {
  onCreate: (country: Partial<Country>) => Promise<void>;
}

export function CountryDialog({ onCreate }: CountryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    isoCode: "", 
    currency: "", 
    phonePrefix: "" 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate(formData);
      setOpen(false);
      setFormData({ name: "", isoCode: "", currency: "", phonePrefix: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hover:bg-primary-hover">
          <Plus className="mr-2 h-5 w-5" /> Nouveau Pays
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau pays</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du pays</Label>
            <Input 
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ex: France"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code ISO</Label>
              <Input 
                id="code"
                value={formData.isoCode}
                onChange={(e) => setFormData({ ...formData, isoCode: e.target.value })}
                placeholder="ex: FR"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Input 
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                placeholder="ex: EUR"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phonePrefix">Préfixe téléphonique</Label>
            <Input 
              id="phonePrefix"
              value={formData.phonePrefix}
              onChange={(e) => setFormData({ ...formData, phonePrefix: e.target.value })}
              placeholder="ex: +33"
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
