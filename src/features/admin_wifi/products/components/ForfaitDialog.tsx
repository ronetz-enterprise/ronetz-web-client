import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, MapPin } from 'lucide-react';
import type { CreateProductRequest } from '@/core/api/endpoints/forfaitApi';
import { useSites } from '@/features/admin_wifi/sites/hooks/useSites';

interface ForfaitDialogProps {
  onCreate: (data: CreateProductRequest) => Promise<void>;
}

const CURRENCIES = ['XAF', 'XOF', 'EUR', 'USD', 'NGN', 'KES', 'GHS'];

const empty = {
  name: '',
  description: '',
  price: '',
  currency: 'XAF',
  durationMinutes: '',
  dataVolumeMb: '',
  maxConcurrentDevices: '',
};

export function ForfaitDialog({ onCreate }: ForfaitDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(empty);
  const [siteIds, setSiteIds] = useState<string[]>([]);
  const { sites, loading: sitesLoading } = useSites();

  const set = (field: keyof typeof empty, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleSite = (id: string) =>
    setSiteIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onCreate({
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      currency: form.currency,
      durationMinutes: Number(form.durationMinutes),
      dataVolumeMb: Number(form.dataVolumeMb),
      maxConcurrentDevices: Number(form.maxConcurrentDevices),
      siteIds,
    });
    setLoading(false);
    setOpen(false);
    setForm(empty);
    setSiteIds([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-5 w-5" /> Forfait
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-110 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau forfait</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du forfait</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Forfait 1h"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Accès illimité 1 heure"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                type="number"
                min="1"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <select
                id="currency"
                value={form.currency}
                onChange={(e) => set('currency', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Durée (minutes)</Label>
              <Input
                id="durationMinutes"
                type="number"
                min="1"
                value={form.durationMinutes}
                onChange={(e) => set('durationMinutes', e.target.value)}
                placeholder="60"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataVolumeMb">Volume (Mo)</Label>
              <Input
                id="dataVolumeMb"
                type="number"
                min="1"
                value={form.dataVolumeMb}
                onChange={(e) => set('dataVolumeMb', e.target.value)}
                placeholder="500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxConcurrentDevices">Appareils simultanés max</Label>
            <Input
              id="maxConcurrentDevices"
              type="number"
              min="1"
              value={form.maxConcurrentDevices}
              onChange={(e) => set('maxConcurrentDevices', e.target.value)}
              placeholder="1"
              required
            />
          </div>

          {/* Sites */}
          <div className="space-y-2">
            <Label>Sites valides <span className="text-red-500">*</span></Label>
            {sitesLoading ? (
              <div className="flex items-center gap-2 text-sm text-slate-400 py-2">
                <Loader2 size={14} className="animate-spin" />
                Chargement des sites…
              </div>
            ) : sites.length === 0 ? (
              <p className="text-sm text-slate-400 py-2">Aucun site disponible.</p>
            ) : (
              <div className="border border-input rounded-md divide-y divide-slate-100 max-h-40 overflow-y-auto">
                {sites.map((site) => (
                  <label
                    key={site.id}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={siteIds.includes(site.id)}
                      onChange={() => toggleSite(site.id)}
                      className="h-4 w-4 rounded border-slate-300 accent-slate-900"
                    />
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span className="text-sm font-medium text-slate-700 truncate">{site.name}</span>
                      {site.address && (
                        <span className="text-xs text-slate-400 truncate">{site.address}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
            {siteIds.length > 0 && (
              <p className="text-xs text-slate-500">{siteIds.length} site{siteIds.length > 1 ? 's' : ''} sélectionné{siteIds.length > 1 ? 's' : ''}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || siteIds.length === 0}
            className="w-full mt-6"
          >
            {loading ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : null}
            Enregistrer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
