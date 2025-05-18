
import React from 'react';
import { Button } from '@/components/ui/button';
import { Provider } from '@/contexts/auth/types';
import { Github, Mail } from 'lucide-react';

interface SocialLoginButtonsProps {
  onProviderClick: (provider: Provider) => void;
  isLoading?: boolean;
  className?: string;
}

const SocialLoginButtons = ({ onProviderClick, isLoading = false, className = '' }: SocialLoginButtonsProps) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Google Login Button */}
      <Button 
        variant="outline" 
        type="button"
        className="flex items-center justify-center gap-2 h-11"
        disabled={isLoading}
        onClick={() => onProviderClick('google')}
      >
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
        <span>Continue with Google</span>
      </Button>

      {/* GitHub Login Button */}
      <Button 
        variant="outline" 
        type="button"
        className="flex items-center justify-center gap-2 h-11"
        disabled={isLoading}
        onClick={() => onProviderClick('github')}
      >
        <Github size={18} />
        <span>Continue with GitHub</span>
      </Button>

      {/* Microsoft Login Button */}
      <Button 
        variant="outline" 
        type="button"
        className="flex items-center justify-center gap-2 h-11"
        disabled={isLoading}
        onClick={() => onProviderClick('microsoft')}
      >
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
          <path fill="#f3f3f3" d="M0 0h23v23H0z" />
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
        <span>Continue with Microsoft</span>
      </Button>

      {/* Apple Login Button */}
      <Button 
        variant="outline" 
        type="button"
        className="flex items-center justify-center gap-2 h-11"
        disabled={isLoading}
        onClick={() => onProviderClick('apple')}
      >
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
        </svg>
        <span>Continue with Apple</span>
      </Button>

      {/* Email Login Divider */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Email Login Button */}
      <Button 
        variant="outline" 
        type="button"
        className="flex items-center justify-center gap-2 h-11"
        disabled={isLoading}
        onClick={() => {}}
      >
        <Mail size={18} />
        <span>Email and Password</span>
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
