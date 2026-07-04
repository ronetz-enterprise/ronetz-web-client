import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { navigationConfig } from '../config/navigation';
import { 
  LogOut, 
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';

const SidebarLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navigationConfig.filter(item => 
    user && item.roles.includes(user.role)
  );

  const initials =
    (user?.firstName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();
  const displayName = user?.firstName ?? user?.email ?? "—";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">R</div>
              <span className="font-black text-xl tracking-tight text-slate-800">Rik WiFi</span>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4 space-y-1">
            <SidebarMenu>
              {filteredNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.href}
                    tooltip={item.title}
                  >
                    <NavLink to={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-bold">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-slate-100 mt-auto">
             <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{displayName}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} /> Déconnexion
                </button>
             </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/50 lg:hidden">
            <SidebarTrigger />
            <span className="font-black text-lg text-slate-800">Rik WiFi</span>
            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
          </header>
          
          <div className="flex-1 p-8 md:p-12 overflow-y-auto">
             <div className="max-w-7xl mx-auto">
                <Outlet />
             </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
