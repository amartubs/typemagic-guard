
import React, { ReactNode, useEffect } from 'react';
import { authOperations } from './authService';
import { useAuthState, useAuthActions } from './authHooks';
import AuthContext from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuthState();
  const authActions = useAuthActions(authState.setLoading);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (authState.loading) {
        console.warn('Auth loading timeout reached, forcing loading to false');
        authState.setLoading(false);
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timeout);
  }, [authState.loading, authState.setLoading]);

  const signInWithGoogle = async (): Promise<boolean> => {
    return authOperations.signInWithProvider('google');
  };

  const contextValue = {
    ...authState,
    ...authActions,
    login: authOperations.login,
    register: authOperations.register,
    resetPassword: authOperations.resetPassword,
    signInWithProvider: authOperations.signInWithProvider,
    updateUserProfile: authOperations.updateUserProfile,
    updatePassword: authOperations.updatePassword,
    signInWithGoogle,
    setTwoFactorRequired: () => {}
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
