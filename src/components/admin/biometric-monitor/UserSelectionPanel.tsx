
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfileAnalysis } from './useBiometricMonitorData';

interface UserSelectionPanelProps {
  userAnalyses: UserProfileAnalysis[];
  selectedUser: string;
  onUserSelect: (userId: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export const UserSelectionPanel: React.FC<UserSelectionPanelProps> = ({
  userAnalyses,
  selectedUser,
  onUserSelect,
  onRefresh,
  refreshing
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Selection</CardTitle>
        <CardDescription>Select a user to view detailed biometric analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedUser} onValueChange={onUserSelect}>
            <SelectTrigger>
              <SelectValue placeholder={userAnalyses.length > 0 ? "Select a user to analyze" : "No users available"} />
            </SelectTrigger>
            <SelectContent>
              {userAnalyses.length > 0 ? (
                userAnalyses.map((analysis) => (
                  <SelectItem key={analysis.userId} value={analysis.userId}>
                    {analysis.userEmail} ({analysis.profile.status})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-users" disabled>
                  No biometric profiles found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          
          <Button onClick={onRefresh} disabled={refreshing} className="w-full">
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>

          {userAnalyses.length === 0 && (
            <div className="text-sm text-muted-foreground p-4 border rounded-lg">
              <p>No biometric profiles found in the database.</p>
              <p className="mt-2">Users need to complete the biometric enrollment process to appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
