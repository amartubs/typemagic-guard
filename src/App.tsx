
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth';
import Index from '@/pages/Index';
import Demo from '@/pages/Demo';
import DemoEnvironment from '@/pages/DemoEnvironment';
import Onboarding from '@/pages/Onboarding';
import Pricing from '@/pages/Pricing';
import Login from '@/pages/Login';
import Auth from '@/pages/Auth';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Support from '@/pages/Support';
import EnterprisePortal from '@/pages/EnterprisePortal';
import PatentDrawingsPage from '@/pages/PatentDrawingsPage';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/demo-environment" element={<DemoEnvironment />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/patent-drawings" element={<PatentDrawingsPage />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/enterprise"
                element={
                  <PrivateRoute>
                    <EnterprisePortal />
                  </PrivateRoute>
                }
              />
              <Route
                path="/support"
                element={
                  <PrivateRoute>
                    <Support />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <Admin />
                  </PrivateRoute>
                }
              />
              
              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
