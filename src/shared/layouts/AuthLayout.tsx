import React from 'react';
import { Outlet } from 'react-router-dom';
import { Wifi } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="grid min-h-screen bg-background text-foreground lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex flex-col justify-center gap-8 p-6 sm:p-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Wifi className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight">RONET</span>
        </div>

        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>

      {/* Right — decorative gradient panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-(--accent-green) via-cyan-700 to-blue-900 lg:flex lg:items-end lg:justify-center lg:p-12">
        <div className="w-full max-w-sm rounded-lg border border-border/40 bg-card/90 p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Débit descendant
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-(--accent-green)">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--accent-green) opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-(--accent-green)" />
              </span>
              Fibre active
            </span>
          </div>
          <p className="mt-1.5">
            <span className="text-2xl font-bold text-card-foreground">940.5</span>{' '}
            <span className="text-sm font-medium text-(--accent-green)">Mbps</span>
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-(--accent-green) to-cyan-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
