
import React from 'react';
import { CheckCircle } from 'lucide-react';

const PrivacyRights: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-medium">Your Privacy Rights</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Right to Access</h4>
          <p className="text-sm text-muted-foreground">
            You can request and download all personal data we have about you.
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Right to Deletion</h4>
          <p className="text-sm text-muted-foreground">
            You can request complete deletion of your personal data.
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Right to Rectification</h4>
          <p className="text-sm text-muted-foreground">
            You can correct inaccurate data through your profile settings.
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Right to Portability</h4>
          <p className="text-sm text-muted-foreground">
            Export your data in a machine-readable format.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyRights;
