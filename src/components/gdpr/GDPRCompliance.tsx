
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Download, 
  Trash2, 
  Shield, 
  FileText,
  Clock,
  CheckCircle 
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const GDPRCompliance: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [exportRequested, setExportRequested] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);

  const handleDataExport = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gdpr-export', {
        body: { userId: user.id }
      });

      if (error) throw error;

      // Create and download the export file
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gdpr-export-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportRequested(true);
      toast({
        title: "Data Export Complete",
        description: "Your personal data has been downloaded successfully."
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDataDeletion = async () => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('gdpr-delete', {
        body: { userId: user.id }
      });

      if (error) throw error;

      setDeletionRequested(true);
      toast({
        title: "Deletion Request Submitted",
        description: "Your data deletion request has been submitted and will be processed within 30 days."
      });
    } catch (error) {
      console.error('Deletion error:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to submit deletion request. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            GDPR Compliance & Data Rights
          </CardTitle>
          <CardDescription>
            Manage your personal data and exercise your rights under GDPR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Data Export
                </CardTitle>
                <CardDescription>
                  Download all your personal data in a portable format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Includes: Profile data, biometric patterns, usage analytics, and subscription history
                  </div>
                  {exportRequested && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Export Completed
                    </Badge>
                  )}
                  <Button 
                    onClick={handleDataExport}
                    disabled={loading}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? 'Exporting...' : 'Export My Data'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Data Deletion
                </CardTitle>
                <CardDescription>
                  Request complete deletion of your account and data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm text-amber-600">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>This action cannot be undone. Your account will be permanently deleted.</span>
                  </div>
                  {deletionRequested && (
                    <Badge variant="destructive" className="gap-1">
                      <Clock className="h-3 w-3" />
                      Deletion Requested
                    </Badge>
                  )}
                  <Button 
                    onClick={handleDataDeletion}
                    disabled={loading || deletionRequested}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {loading ? 'Processing...' : 'Delete My Account'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Data Processing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">What data we collect:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Profile information (name, email, organization details)</li>
                    <li>Biometric authentication patterns (keystroke timing)</li>
                    <li>Usage analytics and login attempts</li>
                    <li>Subscription and payment information</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">How we protect your data:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>End-to-end encryption for biometric data</li>
                    <li>Secure data transmission using HTTPS</li>
                    <li>Regular security audits and monitoring</li>
                    <li>Access controls and user authentication</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Your rights:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Right to access your personal data</li>
                    <li>Right to rectify inaccurate data</li>
                    <li>Right to delete your data (right to be forgotten)</li>
                    <li>Right to data portability</li>
                    <li>Right to object to data processing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default GDPRCompliance;
