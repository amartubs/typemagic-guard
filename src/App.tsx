
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth';
import ReactReadyWrapper from '@/components/ReactReadyWrapper';

import Index from '@/pages/Index';
import Demo from '@/pages/Demo';
import DemoEnvironment from '@/pages/DemoEnvironment';
import Onboarding from '@/pages/Onboarding';
import Pricing from '@/pages/Pricing';
import Auth from '@/pages/Auth';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Support from '@/pages/Support';
import EnterprisePortal from '@/pages/EnterprisePortal';
import PatentDrawingsPage from '@/pages/PatentDrawingsPage';
import PatentApplicationPage from '@/pages/PatentApplicationPage';
import PitchDeck from '@/pages/PitchDeck';
import FeatureShowcase from '@/pages/FeatureShowcase';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin';
import BiometricDemo from '@/pages/BiometricDemo';
import LicenseManagement from '@/pages/LicenseManagement';
import Infrastructure from '@/pages/Infrastructure';
import PrivateRoute from '@/components/auth/PrivateRoute';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import OfflineIndicator from '@/components/pwa/OfflineIndicator';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { AccessibleWrapper } from '@/components/accessibility/AccessibleWrapper';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ReactReadyWrapper>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <AccessibleWrapper
                className="min-h-screen bg-background text-foreground"
                landmarkRole="main"
                skipLinks={[
                  { href: '#main-content', label: 'Skip to main content' },
                  { href: '#navigation', label: 'Skip to navigation' }
                ]}
              >
                {/* PWA Components */}
                <OfflineIndicator />
                <InstallPrompt />
                
                <div id="main-content">
                  <ErrorBoundary>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/demo" element={<Demo />} />
                      <Route path="/biometric-demo" element={<BiometricDemo />} />
                      <Route path="/demo-environment" element={<DemoEnvironment />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/patent-drawings" element={<PatentDrawingsPage />} />
                      <Route path="/patent-application" element={<PatentApplicationPage />} />
                      <Route path="/pitch-deck" element={<PitchDeck />} />
                      
                      {/* Legacy redirects */}
                      <Route path="/login" element={<Navigate to="/auth" replace />} />
                      <Route path="/register" element={<Navigate to="/auth" replace />} />
                      <Route path="/signup" element={<Navigate to="/auth" replace />} />
                      
                      {/* Protected routes */}
                      <Route
                        path="/dashboard"
                        element={
                          <ErrorBoundary>
                            <PrivateRoute>
                              <Dashboard />
                            </PrivateRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ErrorBoundary>
                            <PrivateRoute>
                              <Profile />
                            </PrivateRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <ErrorBoundary>
                            <PrivateRoute>
                              <Settings />
                            </PrivateRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/enterprise"
                        element={
                          <ErrorBoundary>
                            <PrivateRoute>
                              <EnterprisePortal />
                            </PrivateRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/support"
                        element={
                          <ErrorBoundary>
                            <PrivateRoute>
                              <Support />
                            </PrivateRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/features"
                        element={
                          <ErrorBoundary>
                            <PrivateRoute>
                              <FeatureShowcase />
                            </PrivateRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <ErrorBoundary>
                            <PrivateRoute>
                              <Admin />
                            </PrivateRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/license"
                        element={
                          <ErrorBoundary>
                            <PrivateRoute>
                              <LicenseManagement />
                            </PrivateRoute>
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/infrastructure"
                        element={
                          <ErrorBoundary>
                            <PrivateRoute>
                              <Infrastructure />
                            </PrivateRoute>
                          </ErrorBoundary>
                        }
                      />
                      
                      {/* Analytics route redirect */}
                      <Route 
                        path="/analytics" 
                        element={<Navigate to="/dashboard" replace />} 
                      />
                      
                      {/* 404 fallback */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ErrorBoundary>
                </div>
                
                <Toaster />
              </AccessibleWrapper>
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </ReactReadyWrapper>
    </ErrorBoundary>
  );
}

export default App;
