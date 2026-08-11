import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronDown,
  PackageSearch,
  Loader2,
  Clock,
  Wifi,
  Smartphone,
  Banknote,
  Info,
  X,
  Ban,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { useForfaits } from '@/modules/commerce/hooks/useForfaits';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const CURRENCIES = ['XAF', 'XOF', 'EUR', 'USD', 'NGN', 'KES', 'GHS'];

const DURATION_UNITS = [
  { value: 'minutes', label: 'Minutes', factor: 1 },
  { value: 'heures', label: 'Heures', factor: 60 },
  { value: 'jours', label: 'Jours', factor: 60 * 24 },
  { value: 'mois', label: 'Mois', factor: 60 * 24 * 30 },
] as const;
type DurationUnit = (typeof DURATION_UNITS)[number]['value'];

const VOLUME_UNITS = [
  { value: 'Mo', label: 'Mo', factor: 1 },
  { value: 'Go', label: 'Go', factor: 1000 },
] as const;
type VolumeUnit = (typeof VOLUME_UNITS)[number]['value'];

// -1 means "illimité" — the convention already used by forfaitCompactHeader.tsx.
const UNLIMITED = -1;

function pickDurationUnit(minutes: number): DurationUnit {
  if (minutes > 0 && minutes % DURATION_UNITS[3].factor === 0) return 'mois';
  if (minutes > 0 && minutes % DURATION_UNITS[2].factor === 0) return 'jours';
  if (minutes > 0 && minutes % DURATION_UNITS[1].factor === 0) return 'heures';
  return 'minutes';
}

function pickVolumeUnit(mb: number): VolumeUnit {
  return mb > 0 && mb % VOLUME_UNITS[1].factor === 0 ? 'Go' : 'Mo';
}

interface FormState {
  name: string;
  description: string;
  price: string;
  currency: string;
  durationAmount: string;
  durationUnit: DurationUnit;
  volumeAmount: string;
  volumeUnit: VolumeUnit;
  volumeUnlimited: boolean;
  maxConcurrentDevices: string;
}

function formStateFromForfait(f: {
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  durationMinutes: number;
  dataVolumeMb: number;
  maxConcurrentDevices: number;
}): FormState {
  // Duration isn't offered as "illimité" in this form (not asked for, and
  // an unbounded access pass is an unusual product) — a -1 here would only
  // come from data edited elsewhere; guard it to 0 rather than show "-1".
  const durationMinutes = f.durationMinutes > 0 ? f.durationMinutes : 0;
  const durationUnit = pickDurationUnit(durationMinutes);
  const durationFactor = DURATION_UNITS.find((u) => u.value === durationUnit)!.factor;

  const volumeUnlimited = f.dataVolumeMb === UNLIMITED;
  const volumeUnit = volumeUnlimited ? 'Mo' : pickVolumeUnit(f.dataVolumeMb);
  const volumeFactor = VOLUME_UNITS.find((u) => u.value === volumeUnit)!.factor;

  return {
    name: f.name,
    description: f.description ?? '',
    price: String(f.price),
    currency: f.currency,
    durationAmount: String(durationMinutes / durationFactor),
    durationUnit,
    volumeAmount: volumeUnlimited ? '' : String(f.dataVolumeMb / volumeFactor),
    volumeUnit,
    volumeUnlimited,
    maxConcurrentDevices: String(f.maxConcurrentDevices),
  };
}

const ForfaitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { forfaits, loading, updateForfait, toggleForfaitActive, deleteForfait } = useForfaits(null);
  const { user } = useAuthStore();
  const isAdminWifi = user?.role === 'ADMIN_WIFI';

  const forfait = forfaits.find((f) => f.id === id) ?? null;

  const [form, setForm] = useState<FormState | null>(null);
  const [baseline, setBaseline] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  // (Re)seed the form whenever the underlying forfait changes — first load,
  // or after a save round-trips through the API and comes back normalized.
  useEffect(() => {
    if (!forfait) return;
    const next = formStateFromForfait(forfait);
    setForm(next);
    setBaseline(next);
  }, [forfait]);

  const isDirty = useMemo(
    () => !!form && !!baseline && JSON.stringify(form) !== JSON.stringify(baseline),
    [form, baseline]
  );

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [field]: value } : f));

  const handleCancel = () => setForm(baseline);

  const handleToggleActive = () => {
    if (forfait) toggleForfaitActive(forfait.id);
  };

  const handleDelete = () => {
    if (!forfait) return;
    if (window.confirm('Supprimer définitivement ce forfait ?')) {
      deleteForfait(forfait.id);
      navigate('/forfaits');
    }
  };

  const handleSave = async () => {
    if (!forfait || !form) return;
    setSaving(true);
    try {
      const durationFactor = DURATION_UNITS.find((u) => u.value === form.durationUnit)!.factor;
      const volumeFactor = VOLUME_UNITS.find((u) => u.value === form.volumeUnit)!.factor;
      await updateForfait(forfait.id, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        currency: form.currency,
        durationMinutes: Math.round(Number(form.durationAmount) * durationFactor),
        dataVolumeMb: form.volumeUnlimited
          ? UNLIMITED
          : Math.round(Number(form.volumeAmount) * volumeFactor),
        maxConcurrentDevices: Number(form.maxConcurrentDevices),
        siteIds: forfait.siteIds ?? [],
      });
      // useForfaits already updates `forfaits` in place, which retriggers the
      // effect above and re-seeds form/baseline from the saved values.
    } catch {
      // toast already shown by the hook
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading ? (
          <div className="max-w-3xl mx-auto p-6 space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        ) : forfait && form ? (
          <div className="flex  max-w-5xl mx-auto flex-col w-full justify-center">

            <div className="flex items-center justify-between gap-3 px-3 lg:px-5 py-3">
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="icon-sm" onClick={() => navigate('/forfaits')} aria-label="Retour aux forfaits">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className=" font-semibold text-foreground tracking-tight">
                  {forfait ? forfait.name : 'Détail du forfait'}
                </h1>
              </div>

              {isAdminWifi && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Plus d'actions
                      <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem
                      variant={forfait.active ? 'destructive' : 'default'}
                      onClick={handleToggleActive}
                    >
                      {forfait.active ? (
                        <Ban className="mr-2 h-4 w-4" />
                      ) : (
                        <RotateCcw className="mr-2 h-4 w-4" />
                      )}
                      {forfait.active ? 'Désactiver' : 'Réactiver'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="flex  gap-3 px-3 lg:px-5">
              <div className="w-full max-w-2xl   space-y-4 pb-24">
                {/* Informations générales — full width: it's the only card
                holding free text, it benefits from the room. */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      Informations générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom du forfait</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        disabled={!isAdminWifi}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optionnel)</Label>
                      <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => set('description', e.target.value)}
                        placeholder="Accès illimité 1 heure"
                        disabled={!isAdminWifi}
                        rows={5}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Limites d'usage — deux cards compactes côte à côte. */}



              </div>
              <div className="w-full max-w-sm   space-y-4 pb-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Durée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1.5">
                        <Input
                          id="durationAmount"
                          type="number"
                          min="1"
                          value={form.durationAmount}
                          onChange={(e) => set('durationAmount', e.target.value)}
                          disabled={!isAdminWifi}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Select
                          value={form.durationUnit}
                          onValueChange={(v) => set('durationUnit', v as DurationUnit)}
                          disabled={!isAdminWifi}
                        >
                          <SelectTrigger id="durationUnit" className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DURATION_UNITS.map((u) => (
                              <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <Wifi className="h-4 w-4 text-muted-foreground" />
                      Volume de données
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1.5">
                        <Input
                          id="volumeAmount"
                          type="number"
                          min="1"
                          value={form.volumeAmount}
                          onChange={(e) => set('volumeAmount', e.target.value)}
                          disabled={!isAdminWifi || form.volumeUnlimited}
                          required={!form.volumeUnlimited}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Select
                          value={form.volumeUnit}
                          onValueChange={(v) => set('volumeUnit', v as VolumeUnit)}
                          disabled={!isAdminWifi || form.volumeUnlimited}
                        >
                          <SelectTrigger id="volumeUnit" className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {VOLUME_UNITS.map((u) => (
                              <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>


                  </CardContent>
                  <CardFooter className="py-2 justify-end">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <Switch
                        checked={form.volumeUnlimited}
                        onCheckedChange={(checked) => set('volumeUnlimited', checked)}
                        disabled={!isAdminWifi}
                      />
                      Illimité
                    </label>
                  </CardFooter>
                </Card>


                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      Connexions simultanées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    <Input
                      id="maxConcurrentDevices"
                      type="number"
                      min="1"
                      value={form.maxConcurrentDevices}
                      onChange={(e) => set('maxConcurrentDevices', e.target.value)}
                      disabled={!isAdminWifi}
                      required
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <Banknote className="h-4 w-4 text-muted-foreground" />
                      Prix
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1.5">
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={(e) => set('price', e.target.value)}
                          disabled={!isAdminWifi}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Select
                          value={form.currency}
                          onValueChange={(v) => set('currency', v)}
                          disabled={!isAdminWifi}
                        >
                          <SelectTrigger id="currency" className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div >
            </div>



          </div>

        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center p-10 space-y-3">
            <div className="flex h-11 w-11 items-center justify-center border border-border">
              <PackageSearch className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">Ce forfait est introuvable.</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/forfaits')}>
              Retour à la liste
            </Button>
          </div>
        )}
      </div>

      {/* Dirty-state action bar — only appears once something changed, stays
          pinned to the bottom of the viewport so it never requires scrolling. */}
      {isDirty && (
        <div className="border-t bg-card px-3 lg:px-5 py-3 flex items-center justify-between gap-3 shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.15)]">
          <p className="text-sm text-muted-foreground">Modifications non enregistrées</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
              <X className="mr-1.5 h-3.5 w-3.5" />
              Annuler
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Enregistrer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForfaitDetailPage;
