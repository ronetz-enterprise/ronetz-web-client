import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, PackageSearch } from 'lucide-react';
import { useForfaits } from '@/modules/commerce/hooks/useForfaits';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { ForfaitDetail } from '@/modules/commerce/components/ForfaitDetail';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const ForfaitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { forfaits, loading, toggleForfaitActive } = useForfaits(null);
  const { user } = useAuthStore();

  const forfait = forfaits.find((f) => f.id === id) ?? null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-3 lg:px-5 border-b py-3">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate('/forfaits')} aria-label="Retour aux forfaits">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Détail du forfait</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading ? (
          <div className="max-w-2xl mx-auto p-6 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : forfait ? (
          <div className="max-w-2xl mx-auto">
            <ForfaitDetail
              forfait={forfait}
              onToggleActive={user?.role === 'ADMIN_WIFI' ? toggleForfaitActive : undefined}
            />
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
    </div>
  );
};

export default ForfaitDetailPage;
