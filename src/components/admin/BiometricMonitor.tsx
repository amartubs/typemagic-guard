
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, Shield, Activity } from 'lucide-react';
import { SystemMetricsCards } from './biometric-monitor/SystemMetricsCards';
import { ConfidenceDistributionChart } from './biometric-monitor/ConfidenceDistributionChart';
import { UserSelectionPanel } from './biometric-monitor/UserSelectionPanel';
import { UserProfileAnalysis } from './biometric-monitor/UserProfileAnalysis';
import { LearningProgressChart } from './biometric-monitor/LearningProgressChart';
import { RiskAssessmentList } from './biometric-monitor/RiskAssessmentList';
import { useBiometricMonitorData } from './biometric-monitor/useBiometricMonitorData';

const BiometricMonitor: React.FC = () => {
  const { 
    userAnalyses, 
    systemMetrics, 
    loading, 
    refreshing, 
    refreshData 
  } = useBiometricMonitorData();
  
  const [selectedUser, setSelectedUser] = useState<string>('');

  const selectedUserAnalysis = userAnalyses.find(u => u.userId === selectedUser);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-pulse">Loading biometric analysis...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SystemMetricsCards metrics={systemMetrics} />
      
      {userAnalyses.length > 0 && (
        <ConfidenceDistributionChart userAnalyses={userAnalyses} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserSelectionPanel
          userAnalyses={userAnalyses}
          selectedUser={selectedUser}
          onUserSelect={setSelectedUser}
          onRefresh={refreshData}
          refreshing={refreshing}
        />

        {selectedUserAnalysis && (
          <UserProfileAnalysis analysis={selectedUserAnalysis} />
        )}
      </div>

      {selectedUserAnalysis && (
        <LearningProgressChart analysis={selectedUserAnalysis} />
      )}

      {userAnalyses.length > 0 && (
        <RiskAssessmentList
          userAnalyses={userAnalyses}
          onUserSelect={setSelectedUser}
        />
      )}
    </div>
  );
};

export default BiometricMonitor;
