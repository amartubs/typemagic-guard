
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Download, FileText } from 'lucide-react';

const DataExport: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDataExport = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Call the GDPR export function
      const { data, error } = await supabase.functions.invoke('gdpr-export', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Error exporting data:', error);
        toast({
          title: "Export Failed",
          description: "Failed to export your data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Create and download the file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Your data has been exported and downloaded.",
      });
    } catch (err) {
      console.error('Error in data export:', err);
      toast({
        title: "Export Failed",
        description: "An unexpected error occurred during data export.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Data Export</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Download a complete copy of your personal data stored in our system. This includes your profile information, 
        biometric patterns, authentication logs, and usage analytics.
      </p>

      <Alert>
        <AlertDescription>
          The exported data will be in JSON format and may contain sensitive information. 
          Please store it securely and do not share it with unauthorized parties.
        </AlertDescription>
      </Alert>

      <Button 
        onClick={handleDataExport} 
        disabled={loading}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {loading ? 'Exporting...' : 'Export My Data'}
      </Button>
    </div>
  );
};

export default DataExport;
