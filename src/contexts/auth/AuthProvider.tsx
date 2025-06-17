
import * as React from 'react';
import { authOperations } from './authService';
import { useAuthState, useAuthActions } from './authHooks';
import AuthContext from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuthState();
  const authActions = useAuthActions(authState.setLoading);

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
