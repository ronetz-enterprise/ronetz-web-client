import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';

// Layouts
import AuthLayout from '@/shared/layouts/AuthLayout';
import PageLayout from '@/shared/layouts/pageLayout';

// Components
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

// Auth (bc-iam)
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Network Ops (bc-network-ops)
import SiteListPage from '@/pages/admin-wifi/SiteListPage';
import WifiDomainSetupPage from '@/pages/admin-wifi/WifiDomainSetupPage';
import RouteurListPage from '@/pages/admin-wifi/RouteurListPage';

// Commerce (bc-commerce)
import ForfaitListPage from '@/pages/admin-wifi/ForfaitListPage';
import StatsPage from '@/pages/admin-wifi/StatsPage';

// Wallet (bc-wallet)
import WalletPage from '@/pages/admin-wifi/WalletPage';

// Souscription (agrégation commerce + payments + access-sessions)
import ForfaitsAchatPage from '@/pages/souscription/ForfaitsAchatPage';
import PaiementPage from '@/pages/souscription/PaiementPage';
import ConfirmationPage from '@/pages/souscription/ConfirmationPage';
import MesAccesPage from '@/pages/souscription/MesAccesPage';
import MesSouscriptionsPage from '@/pages/souscription/MesSouscriptionsPage';
import HomePage from '@/pages/souscription/HomePage';

// IAM (bc-iam) — users + profile
import UserListPage from '@/pages/admin/UserListPage';
import ProfilePage from '@/pages/account/ProfilePage';

// Analytics & Audit (bc-analytics-audit)
import LogListPage from '@/pages/admin/LogListPage';

// Master Data & Payments
import CountryListPage from '@/pages/admin/CountryListPage';
import PaymentMethodListPage from '@/pages/admin/PaymentMethodListPage';

// Store
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useTopologyStore } from '@/modules/network-ops/store/topologyStore';
// Helper to allow nested protected routes
import { Outlet } from 'react-router-dom';

import {AppProviders} from './firebase';
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
  const { user, initializing } = useAuthStore();

  return (
    <AppProviders>
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
          {/* Note: kept as-is — CLIENT lands on /home here but on /souscriptions
              right after login (useAuth) / on role-mismatch (ProtectedRoute).
              Pre-existing inconsistency, not something this refactor should
              silently resolve either way. */}
          <Route path="/" element={
            initializing ? null : // Firebase restores the session async — avoid a flash redirect to /login
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
    </AppProviders>
  );
}

export default App;
