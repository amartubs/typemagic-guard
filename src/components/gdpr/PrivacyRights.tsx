
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Trash2, Edit, Eye, UserX } from 'lucide-react';

const PrivacyRights: React.FC = () => {
  const rights = [
    {
      icon: Eye,
      title: 'Right to Access',
      description: 'You can request access to your personal data we process',
      status: 'Available',
      action: 'Use the Data Export feature above'
    },
    {
      icon: Edit,
      title: 'Right to Rectification',
      description: 'You can correct inaccurate or incomplete personal data',
      status: 'Available',
      action: 'Edit your profile information in the Profile tab'
    },
    {
      icon: Trash2,
      title: 'Right to Erasure',
      description: 'You can request deletion of your personal data',
      status: 'Available',
      action: 'Use the Account Deletion feature above'
    },
    {
      icon: UserX,
      title: 'Right to Restrict Processing',
      description: 'You can limit how we process your personal data',
      status: 'Contact Support',
      action: 'Contact our support team for assistance'
    },
    {
      icon: FileText,
      title: 'Right to Data Portability',
      description: 'You can receive your data in a machine-readable format',
      status: 'Available',
      action: 'Use the Data Export feature in JSON format'
    },
    {
      icon: CheckCircle,
      title: 'Right to Object',
      description: 'You can object to certain types of processing',
      status: 'Contact Support',
      action: 'Contact our support team for specific objections'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Your Privacy Rights</h3>
        <p className="text-sm text-muted-foreground">
          Under GDPR, you have the following rights regarding your personal data:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rights.map((right, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <right.icon className="h-4 w-4 text-primary" />
                {right.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>
                {right.description}
              </CardDescription>
              
              <div className="flex items-center justify-between">
                <Badge variant={right.status === 'Available' ? 'default' : 'secondary'}>
                  {right.status}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground">
                <strong>How to exercise:</strong> {right.action}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Data Protection Contact</h4>
        <p className="text-sm text-muted-foreground">
          For any privacy-related questions or to exercise your rights, contact our Data Protection Officer at:
          <br />
          <strong>Email:</strong> privacy@typemagicguard.com
          <br />
          <strong>Response Time:</strong> We will respond to your request within 30 days
        </p>
      </div>
    </div>
  );
};

export default PrivacyRights;
