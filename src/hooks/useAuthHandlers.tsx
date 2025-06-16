
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, SocialProvider } from '@/contexts/AuthContext';

export const useAuthHandlers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    login, 
    register, 
    resetPassword,
    signInWithProvider,
    verifyTwoFactorCode, 
    sendTwoFactorCode
  } = useAuth();
  
  // Individual loading states for different operations
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLoginSubmit = async (email: string, password: string) => {
    console.log('📝 Login form submitted for:', email);
    setLoginLoading(true);
    
    try {
      const success = await login(email, password);
      console.log('📝 Login result:', success);
      
      if (success) {
        console.log('✅ Login successful, navigating to dashboard');
        // Navigate directly since auth state will be updated
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        console.log('❌ Login failed');
      }
    } catch (error) {
      console.error('📝 Login submission error:', error);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (email: string) => {
    if (!resetPassword) {
      return;
    }

    console.log('🔄 Forgot password submitted for:', email);
    setForgotLoading(true);
    
    try {
      const success = await resetPassword(email);
      
      if (success) {
        return true;
      }
      return false;
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    console.log('🔗 Social login attempted with:', provider);
    const success = await signInWithProvider(provider);
    
    if (success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
  };

  const handleTwoFactorSubmit = async (code: string) => {
    console.log('🔐 Two factor code submitted');
    setVerifyingCode(true);
    
    try {
      const success = await verifyTwoFactorCode(code);
      
      if (success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      }
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleResendCode = async () => {
    console.log('📨 Resending two factor code');
    await sendTwoFactorCode();
  };

  const handleRegisterSubmit = async (
    name: string,
    email: string,
    password: string,
    userType: 'individual' | 'company' | 'charity',
    organizationName?: string,
    organizationSize?: number
  ) => {
    console.log('📝 Registration form submitted for:', email);
    setRegisterLoading(true);
    
    try {
      const success = await register(
        name, 
        email, 
        password, 
        userType,
        'free',
        organizationName,
        organizationSize
      );
      
      if (success) {
        return true;
      }
      return false;
    } finally {
      setRegisterLoading(false);
    }
  };

  return {
    loginLoading,
    forgotLoading,
    verifyingCode,
    registerLoading,
    handleLoginSubmit,
    handleForgotPasswordSubmit,
    handleSocialLogin,
    handleTwoFactorSubmit,
    handleResendCode,
    handleRegisterSubmit
  };
};
