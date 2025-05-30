
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, ExternalLink, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DomainConfigurationProps {
  domain?: string;
  onChange: (domain: string) => void;
}

const DomainConfiguration: React.FC<DomainConfigurationProps> = ({ domain = '', onChange }) => {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed' | null>(null);

  const handleVerifyDomain = async () => {
    if (!domain) {
      toast({
        title: "Error",
        description: "Please enter a domain first.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate domain verification process
    setTimeout(() => {
      setIsVerifying(false);
      // Randomly set verification status for demo
      const success = Math.random() > 0.3;
      setVerificationStatus(success ? 'verified' : 'failed');
      
      toast({
        title: success ? "Domain Verified" : "Verification Failed",
        description: success 
          ? "Your domain has been successfully verified and configured."
          : "Domain verification failed. Please check DNS records.",
        variant: success ? "default" : "destructive",
      });
    }, 2000);
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return null;
    }
  };

  const dnsRecords = [
    { type: 'CNAME', name: domain || 'auth.yourcompany.com', value: 'your-app.typemagic.app' },
    { type: 'TXT', name: domain || 'yourcompany.com', value: 'typemagic-verification=abc123def456' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Domain Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="custom_domain">Custom Domain</Label>
              {getStatusBadge()}
            </div>
            <div className="flex gap-2">
              <Input
                id="custom_domain"
                value={domain}
                onChange={(e) => onChange(e.target.value)}
                placeholder="auth.yourcompany.com"
                className="flex-1"
              />
              <Button 
                onClick={handleVerifyDomain}
                disabled={isVerifying || !domain}
                variant="outline"
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the subdomain where you want to host your authentication portal
            </p>
          </div>

          {domain && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> After configuring your domain, you'll need to update your DNS records 
                and wait for propagation (usually 24-48 hours).
              </AlertDescription>
            </Alert>
          )}
        </div>

        {domain && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Required DNS Records</h4>
              <div className="space-y-3">
                {dnsRecords.map((record, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Type:</span> {record.type}
                      </div>
                      <div className="md:col-span-2">
                        <div className="space-y-1">
                          <div><span className="font-medium">Name:</span> {record.name}</div>
                          <div><span className="font-medium">Value:</span> <code className="text-xs bg-background px-1 rounded">{record.value}</code></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Setup Instructions</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Log in to your domain registrar's control panel</li>
                <li>Navigate to DNS management or DNS records section</li>
                <li>Add the DNS records shown above</li>
                <li>Save the changes and wait for DNS propagation</li>
                <li>Click "Verify" button once propagation is complete</li>
              </ol>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
                <span>Need help? Check our </span>
                <Button variant="link" className="p-0 h-auto text-sm">
                  domain setup documentation
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DomainConfiguration;
