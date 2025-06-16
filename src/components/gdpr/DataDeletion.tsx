
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Trash2, AlertTriangle } from 'lucide-react';

const DataDeletion: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [acknowledgements, setAcknowledgements] = useState({
    understand: false,
    irreversible: false,
    exportFirst: false,
  });

  const isConfirmationValid = confirmationText === 'DELETE MY ACCOUNT' && 
    Object.values(acknowledgements).every(Boolean);

  const handleDataDeletion = async () => {
    if (!user?.id || !isConfirmationValid) return;

    setLoading(true);
    try {
      // Call the GDPR deletion function
      const { error } = await supabase.functions.invoke('gdpr-delete', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Error deleting data:', error);
        toast({
          title: "Deletion Failed",
          description: "Failed to delete your data. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account Scheduled for Deletion",
        description: "Your account and all associated data will be permanently deleted within 30 days.",
      });

      // Redirect to a goodbye page or logout
      window.location.href = '/';
    } catch (err) {
      console.error('Error in data deletion:', err);
      toast({
        title: "Deletion Failed",
        description: "An unexpected error occurred during account deletion.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trash2 className="h-5 w-5 text-destructive" />
        <h3 className="text-lg font-semibold text-destructive">Account Deletion</h3>
      </div>
      
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Warning:</strong> This action is irreversible. Once you delete your account, 
          all your data including biometric patterns, authentication logs, and profile information 
          will be permanently removed from our systems.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="understand"
            checked={acknowledgements.understand}
            onCheckedChange={(checked) => 
              setAcknowledgements(prev => ({ ...prev, understand: checked as boolean }))
            }
          />
          <Label htmlFor="understand" className="text-sm">
            I understand that this action cannot be undone
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="irreversible"
            checked={acknowledgements.irreversible}
            onCheckedChange={(checked) => 
              setAcknowledgements(prev => ({ ...prev, irreversible: checked as boolean }))
            }
          />
          <Label htmlFor="irreversible" className="text-sm">
            I understand that all my data will be permanently deleted
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="exportFirst"
            checked={acknowledgements.exportFirst}
            onCheckedChange={(checked) => 
              setAcknowledgements(prev => ({ ...prev, exportFirst: checked as boolean }))
            }
          />
          <Label htmlFor="exportFirst" className="text-sm">
            I have exported my data if needed
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmation">
          Type "DELETE MY ACCOUNT" to confirm:
        </Label>
        <Input
          id="confirmation"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder="DELETE MY ACCOUNT"
        />
      </div>

      <Button 
        variant="destructive"
        onClick={handleDataDeletion} 
        disabled={loading || !isConfirmationValid}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        {loading ? 'Deleting Account...' : 'Delete My Account'}
      </Button>
    </div>
  );
};

export default DataDeletion;
