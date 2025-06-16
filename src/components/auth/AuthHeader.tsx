
import React from 'react';
import { Shield } from 'lucide-react';

const AuthHeader: React.FC = () => {
  return (
    <div className="mb-4 text-center pt-6 px-6">
      <div className="flex justify-center mb-4">
        <Shield className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-2xl font-bold">Shoale</h1>
      <p className="text-muted-foreground mt-2">
        Secure authentication with keystroke biometrics
      </p>
    </div>
  );
};

export default AuthHeader;
