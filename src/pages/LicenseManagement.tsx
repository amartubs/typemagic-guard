import React from 'react';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import { LicenseStatusCard } from '@/components/licensing/LicenseStatusCard';
import { DeploymentConfigManager } from '@/components/licensing/DeploymentConfigManager';
import { LicenseEnforcementWrapper } from '@/components/licensing/LicenseEnforcementWrapper';

const LicenseManagement: React.FC = () => {
  return (
    <ProtectedLayout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">License Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your licensing configuration and monitor usage limits
          </p>
        </div>

        <LicenseEnforcementWrapper requiredFeature="customSecurity">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LicenseStatusCard />
            <DeploymentConfigManager />
          </div>
        </LicenseEnforcementWrapper>
      </div>
    </ProtectedLayout>
  );
};

export default LicenseManagement;