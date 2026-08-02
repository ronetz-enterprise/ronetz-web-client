import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';

// Layouts
import AuthLayout from '@/shared/layouts/AuthLayout';
import PageLayout from '@/shared/layouts/pageLayout';

// Components
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

// Auth Module
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
// import PasswordResetPage from '@/modules/auth/pages/PasswordResetPage';

// Site Module
import SiteListPage from '@/features/admin_wifi/sites/pages/SiteListPage';
import WifiDomainSetupPage from '@/features/admin_wifi/sites/pages/WifiDomainSetupPage';

// Routeur Module
import RouteurListPage from '@/features/admin_wifi/routeurs/pages/RouteurListPage';

// Forfait Module
import ForfaitListPage from '@/features/admin_wifi/products/pages/ForfaitListPage';

// Stats Module
import StatsPage from '@/features/admin_wifi/stats/pages/StatsPage';

// Wallet Module
import WalletPage from '@/features/admin_wifi/wallet/pages/WalletPage';

// Souscription Module
import ForfaitsAchatPage from '@/features/souscription/pages/ForfaitsAchatPage';
import PaiementPage from '@/features/souscription/pages/PaiementPage';
import ConfirmationPage from '@/features/souscription/pages/ConfirmationPage';
import MesAccesPage from '@/features/souscription/pages/MesAccesPage';
import MesSouscriptionsPage from '@/features/souscription/pages/MesSouscriptionsPage';
import HomePage from '@/features/souscription/pages/HomePage';

// User Module
import UserListPage from '@/features/admin/users/pages/UserListPage';
import ProfilePage from '@/features/admin/users/pages/ProfilePage';

// Log Module
import LogListPage from '@/features/admin/log/pages/LogListPage';

// Admin Module - Localization
import CountryListPage from '@/features/admin/countries/pages/CountryListPage';
import PaymentMethodListPage from '@/features/admin/paiement_method/pages/PaymentMethodListPage';

// Store
import { useAuthStore } from '@/shared/store/authStore';
import { useTopologyStore } from '@/shared/store/topologyStore';
// Helper to allow nested protected routes
import { Outlet } from 'react-router-dom';
function OutletProxy() {
  return <Outlet />;
}

function AcheterRedirect() {
  const activeSiteId = useTopologyStore((s) => s.activeSiteId);
  if (activeSiteId) {
    return <Navigate to={`/acheter/${activeSiteId}`} replace />;
  }
  return (
    <div className="py-20 text-center space-y-3">
      <p className="text-sm text-muted-foreground">
        Aucun site actif. Connectez-vous via un hotspot WiFi pour acheter un forfait.
      </p>
    </div>
  );
}

function App() {
  const { user } = useAuthStore();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
      <TooltipProvider>
        <Toaster position="top-center" richColors />
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route path="/confirmation" element={<ConfirmationPage />} />

          {/* Paiement — page dédiée sans sidebar */}
          <Route
            path="/paiement"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <PaiementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wifi/setup-domain"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_WIFI']}>
                <WifiDomainSetupPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - All Roles */}
          <Route element={<ProtectedRoute><PageLayout /></ProtectedRoute>}>
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* ADMIN-WIFI Specific */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN_WIFI']}><OutletProxy /></ProtectedRoute>}>
               <Route path="/sites" element={<SiteListPage />} />
               <Route path="/routeurs" element={<RouteurListPage />} />
               <Route path="/forfaits" element={<ForfaitListPage />} />
               <Route path="/stats" element={<StatsPage />} />
               <Route path="/wallet" element={<WalletPage />} />
            </Route>

            {/* CLIENT Specific */}
            <Route element={<ProtectedRoute allowedRoles={['CLIENT']}><OutletProxy /></ProtectedRoute>}>
               <Route path="/home" element={<HomePage />} />
               <Route path="/acheter" element={<AcheterRedirect />} />
               <Route path="/acheter/:siteId" element={<ForfaitsAchatPage />} />
               <Route path="/mes-acces" element={<MesAccesPage />} />
               <Route path="/souscriptions" element={<MesSouscriptionsPage />} />
            </Route>

            {/* SUPER_ADMIN Specific */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><OutletProxy /></ProtectedRoute>}>
               <Route path="/admin/users" element={<UserListPage />} />
               <Route path="/admin/logs" element={<LogListPage />} />
               <Route path="/admin/countries" element={<CountryListPage />} />
               <Route path="/admin/payment-methods" element={<PaymentMethodListPage />} />
            </Route>

          </Route>

          {/* Default Redirects */}
          <Route path="/" element={
            user ? (
              user.role === 'CLIENT' ? <Navigate to="/home" replace /> :
              user.role === 'ADMIN_WIFI' ? <Navigate to="/sites" replace /> :
              <Navigate to="/admin/users" replace />
            ) : <Navigate to="/login" replace />
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
