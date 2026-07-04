import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Check } from 'lucide-react';
import type { PaymentMethod, Country } from '@/shared/types';
import { countryApi } from '@/core/api/endpoints/countryApi';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PaymentMethodDialogProps {
  onCreate: (paymentMethod: Partial<PaymentMethod>) => Promise<void>;
}

export function PaymentMethodDialog({ onCreate }: PaymentMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [formData, setFormData] = useState({ 
    name: "", 
    code: "", 
    countryIds: [] as string[],
    active: true
  });

  useEffect(() => {
    if (open) {
      countryApi.getAll().then(setCountries).catch(console.error);
    }
  }, [open]);

  const toggleCountry = (countryId: string) => {
    setFormData(prev => ({
      ...prev,
      countryIds: prev.countryIds.includes(countryId)
        ? prev.countryIds.filter(id => id !== countryId)
        : [...prev.countryIds, countryId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate(formData);
      setOpen(false);
      setFormData({ name: "", code: "", countryIds: [], active: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hover:bg-primary-hover">
          <Plus className="mr-2 h-5 w-5" /> Nouvelle Méthode
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une méthode de paiement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input 
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ex: Orange Money"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Code technique</Label>
            <Input 
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="ex: OM"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Appliquer aux pays</Label>
            <ScrollArea className="h-40 border rounded-md p-2">
              <div className="space-y-2">
                {countries.map(country => (
                  <div key={country.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`country-${country.id}`}
                      checked={formData.countryIds.includes(country.id)}
                      onCheckedChange={() => toggleCountry(country.id)}
                    />
                    <label 
                      htmlFor={`country-${country.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {country.name} ({country.isoCode})
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: !!checked })}
            />
            <Label htmlFor="active">Active par défaut</Label>
          </div>

          <Button type="submit" disabled={loading || formData.countryIds.length === 0} className="w-full mt-6">
            {loading ? <Loader2 className="mr-2 animate-spin h-5 w-5" /> : null}
            Enregistrer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
