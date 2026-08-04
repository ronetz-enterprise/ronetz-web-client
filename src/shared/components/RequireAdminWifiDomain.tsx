import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/authStore';

/**
 * ADMIN_WIFI must have a domain configured before accessing sites / routeurs / forfaits.
 */
export function RequireAdminWifiDomain() {
  const { user } = useAuthStore();

  if (user?.role === 'ADMIN_WIFI' && !user.domainId) {
    return <Navigate to="/wifi/setup-domain" replace />;
  }

  return <Outlet />;
}
