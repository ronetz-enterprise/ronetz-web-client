import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { TooltipProvider } from '@/components/ui/tooltip';

// Layouts
import AuthLayout from '@/shared/layouts/AuthLayout';
import PageLayout from '@/shared/layouts/pageLayout';

// Components
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

// Auth Module
import LoginPage from '@/modules/auth/pages/LoginPage';
import RegisterPage from '@/modules/auth/pages/RegisterPage';
// import PasswordResetPage from '@/modules/auth/pages/PasswordResetPage';

// Site Module
import SiteListPage from '@/modules/site/pages/SiteListPage';

// Routeur Module
import RouteurListPage from '@/modules/routeur/pages/RouteurListPage';

// Forfait Module
import ForfaitListPage from '@/modules/forfait/pages/ForfaitListPage';

// Souscription Module
import ForfaitsAchatPage from '@/modules/souscription/pages/ForfaitsAchatPage';
import PaiementPage from '@/modules/souscription/pages/PaiementPage';
import ConfirmationPage from '@/modules/souscription/pages/ConfirmationPage';
import JetonsPage from '@/modules/souscription/pages/JetonsPage';

// User Module
import UserListPage from '@/modules/user/pages/UserListPage';
import ProfilePage from '@/modules/user/pages/ProfilePage';

// Log Module
import LogListPage from '@/modules/log/pages/LogListPage';

// Store
import { useAuthStore } from '@/shared/store/authStore';
// Helper to allow nested protected routes
import { Outlet } from 'react-router-dom';
function OutletProxy() {
  return <Outlet />;
}

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <TooltipProvider>
        <Toaster position="top-center" richColors />
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Routes - All Roles */}
          <Route element={<ProtectedRoute><PageLayout /></ProtectedRoute>}>
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* ADMIN-WIFI Specific */}


            <Route element={<ProtectedRoute allowedRoles={['ADMIN_WIFI']}><OutletProxy /></ProtectedRoute>}>
               <Route path="/sites" element={<SiteListPage />} />
               <Route path="/routeurs" element={<RouteurListPage />} />
               <Route path="/forfaits" element={<ForfaitListPage />} />
            </Route>

            {/* CLIENT Specific */}
            <Route element={<ProtectedRoute allowedRoles={['CLIENT']}><OutletProxy /></ProtectedRoute>}>
               <Route path="/acheter" element={<ForfaitsAchatPage />} />
               <Route path="/paiement" element={<PaiementPage />} />
               <Route path="/confirmation" element={<ConfirmationPage />} />
               <Route path="/jetons" element={<JetonsPage />} />
            </Route>

            {/* ADMIN Specific */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><OutletProxy /></ProtectedRoute>}>
               <Route path="/admin/users" element={<UserListPage />} />
               <Route path="/admin/logs" element={<LogListPage />} />
            </Route>

          </Route>

          {/* Default Redirects */}
          <Route path="/" element={
            user ? (
              user.role === 'CLIENT' ? <Navigate to="/jetons" replace /> :
              user.role === 'ADMIN_WIFI' ? <Navigate to="/sites" replace /> :
              <Navigate to="/admin/users" replace />
            ) : <Navigate to="/login" replace />
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
