import React from 'react';
import { Outlet } from 'react-router-dom';
import loginHero from '@/assets/login_hero.png';
import { Card } from '@/components/ui/card';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center bg-sidebar justify-center  p-4 text-foreground sm:p-8">
      <Card className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/10  shadow-sm lg:grid-cols-[55%_45%] p-0">
        {/* Left — hero image with brand caption */}
        <div className="relative hidden aspect-square self-start lg:block">
          <img src={loginHero} alt="" className="h-full w-full object-cover " />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8 pt-24">
           
            
           
          </div>
        </div>

        {/* Right — form */}
        <div className="flex flex-col items-center justify-center gap-8 p-6 sm:p-10 relative">
          <div className="w-full max-w-sm  ">
            <Outlet />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthLayout;
