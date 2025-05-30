
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Download, FileText, Database, Clock } from 'lucide-react';

const DataExport: React.FC = () => {
  const { user } = useAuth();
  const [exportLoading, setExportLoading] = useState(false);

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

  return (
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
  );
};

export default DataExport;
