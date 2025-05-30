
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Download, 
  Trash2, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Database,
  Clock
} from 'lucide-react';

const GDPRManagement: React.FC = () => {
  const { user } = useAuth();
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDataExport = async () => {
    if (!user) return;
    
    setExportLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gdpr-export');
      
      if (error) throw error;
      
      // Create and download the export file
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gdpr-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Export Complete",
        description: "Your personal data has been exported and downloaded.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleDataDeletion = async () => {
    if (!user) return;
    
    setDeleteLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gdpr-delete');
      
      if (error) throw error;
      
      toast({
        title: "Account Deletion Initiated",
        description: "Your account and data deletion has been processed.",
      });
      
      // Sign out the user after deletion
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Deletion error:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete your data. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

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
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium">Data Export</h3>
            </div>
            <p className="text-muted-foreground">
              Download a complete copy of your personal data stored in our system.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Profile Information</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Biometric Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Activity Logs</span>
              </div>
            </div>
            <Button 
              onClick={handleDataExport}
              disabled={exportLoading}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {exportLoading ? 'Exporting...' : 'Export My Data'}
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-medium">Data Deletion</h3>
            </div>
            
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Warning:</strong> This action cannot be undone. All your data, 
                including biometric profiles, will be permanently deleted.
              </AlertDescription>
            </Alert>

            {!showDeleteConfirm ? (
              <Button 
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Request Account Deletion
              </Button>
            ) : (
              <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50">
                <p className="font-medium text-red-800">
                  Are you absolutely sure you want to delete your account?
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• All biometric data will be permanently removed</li>
                  <li>• Your profile and preferences will be deleted</li>
                  <li>• Active subscriptions will be cancelled</li>
                  <li>• This action cannot be reversed</li>
                </ul>
                <div className="flex gap-2">
                  <Button 
                    variant="destructive"
                    onClick={handleDataDeletion}
                    disabled={deleteLoading}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deleteLoading ? 'Deleting...' : 'Yes, Delete Everything'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

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
        </CardContent>
      </Card>
    </div>
  );
};

export default GDPRManagement;
