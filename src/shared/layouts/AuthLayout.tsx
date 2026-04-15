import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">


        <div className="">
          <Outlet />
        </div>

       
      </div>
    </div>
  );
};

export default AuthLayout;
