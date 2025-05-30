
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Trash2, AlertTriangle } from 'lucide-react';

const DataDeletion: React.FC = () => {
  const { user } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
  );
};

export default DataDeletion;
