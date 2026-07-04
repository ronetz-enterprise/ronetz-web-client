import React from 'react';
import { Outlet } from 'react-router-dom';
import { Wifi } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between p-10 bg-muted border-r">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Wifi className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">Rik WiFi</span>
        </div>
        <blockquote className="space-y-2">
          <p className="text-sm text-muted-foreground">
            "Connectez vos clients facilement, gérez vos accès WiFi en toute simplicité."
          </p>
          <footer className="text-xs text-muted-foreground">Rik WiFi — MikroTic</footer>
        </blockquote>
      </div>

      {/* Right — form */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Wifi className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight">Rik WiFi</span>
        </div>
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
