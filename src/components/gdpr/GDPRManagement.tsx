
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield } from 'lucide-react';
import DataExport from './DataExport';
import DataDeletion from './DataDeletion';
import PrivacyRights from './PrivacyRights';

const GDPRManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            GDPR Data Rights
          </CardTitle>
          <CardDescription>
            Manage your personal data and privacy rights in accordance with GDPR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DataExport />
          <Separator />
          <DataDeletion />
          <Separator />
          <PrivacyRights />
        </CardContent>
      </Card>
    </div>
  );
};

export default GDPRManagement;
