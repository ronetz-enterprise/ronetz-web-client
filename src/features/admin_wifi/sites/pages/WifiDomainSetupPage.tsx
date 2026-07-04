import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/authStore';
import { siteApi } from '@/core/api/endpoints/siteApi';
import { authApi } from '@/core/api/endpoints/authApi';
import { getJwtPayload } from '@/shared/hooks/jwtUtil';
import type { User, UserRole } from '@/shared/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { useDomains } from '../hooks/useDomain';

function isUserRole(role: string | undefined): role is UserRole {
  return role === 'CLIENT' || role === 'ADMIN_WIFI' || role === 'SUPER_ADMIN';
}

const WifiDomainSetupPage: React.FC = () => {
  const { user, refreshToken, setTokens, setUser } = useAuthStore();
  const { exist, loading } = useDomains();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 🔐 Protection accès
  if (!user || user.role !== 'ADMIN_WIFI') {
    return <Navigate to="/login" replace />;
  }

  // ⏳ Attendre la réponse API AVANT de décider
  if (loading || exist === null) {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // 🔁 Si domaine existe → redirect
  if (exist) {
    return <Navigate to="/sites" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      toast.error('Indiquez un nom pour votre domaine');
      return;
    }

    if (!refreshToken) {
      toast.error('Session invalide, reconnectez-vous');
      return;
    }

    setSubmitting(true);

    try {
      // ✅ 1. Création domaine
      const domainRes = await siteApi.createDomain({ name: trimmed });
      const createdDomainId = domainRes.data.id;

      // ✅ 2. Refresh token (mettre à jour domainId côté JWT)
      const refreshRes = await authApi.refresh(refreshToken);
      const { accessToken, refreshToken: newRefresh } = refreshRes.data;

      setTokens(accessToken, newRefresh);

      // ✅ 3. Rebuild user depuis JWT
      const payload = getJwtPayload(accessToken);

      const role = isUserRole(payload?.role)
        ? payload.role
        : 'ADMIN_WIFI';

      const nextUser: User = {
        id: payload?.sub ?? user.id,
        email: payload?.email ?? user.email,
        role,
        firstName: payload?.firstName ?? user.firstName,
        domainId: payload?.domainId ?? createdDomainId,
      };

      setUser(payload ? nextUser : null);

      toast.success('Domaine créé');

      // 🔁 navigation propre
      navigate('/sites', { replace: true });
    } catch (err: unknown) {
      toast.error(
        getApiErrorMessage(err, 'Impossible de créer le domaine')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="rounded-[2rem] border-slate-200/80 shadow-lg">
          <CardHeader className="space-y-3 text-center pb-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Wifi className="h-7 w-7" />
            </div>

            <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
              Votre domaine Wi-Fi
            </CardTitle>

            <CardDescription className="text-base text-slate-500">
              Créez un domaine pour regrouper vos sites et routeurs.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2 text-left">
                <Label
                  htmlFor="domain-name"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Nom du domaine
                </Label>

                <Input
                  id="domain-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex. Hôtel Central, Campus Nord…"
                  className="h-12 rounded-xl"
                  autoComplete="organization"
                  disabled={submitting}
                />
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl font-semibold"
                disabled={submitting || !name.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création…
                  </>
                ) : (
                  'Créer mon domaine'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WifiDomainSetupPage;