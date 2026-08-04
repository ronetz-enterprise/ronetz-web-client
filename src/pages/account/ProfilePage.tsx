import React from 'react';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const initials = (user.firstName?.[0] ?? user.email?.[0] ?? "?").toUpperCase();
  const displayName = user.firstName ?? user.email;

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Mon Profil</h1>
        <p className="text-sm text-muted-foreground">Gérez vos informations personnelles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="rounded-lg border bg-card p-6 text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-semibold mx-auto">
            {initials}
          </div>
          <div>
            <p className="font-semibold">{displayName}</p>
            <Badge variant="secondary" className="mt-1.5 text-xs">
              {user.role}
            </Badge>
          </div>
        </div>

        {/* Info card */}
        <div className="lg:col-span-2 rounded-lg border bg-card">
          <div className="p-6 space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Informations personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Nom complet</p>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border bg-muted/30">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">{displayName}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border bg-muted/30">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" size="sm">Modifier</Button>
            <Button size="sm">Sécurité</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
