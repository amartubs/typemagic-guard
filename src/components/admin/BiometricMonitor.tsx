
import React, { useState } from 'react';
import { SystemMetricsCards } from './biometric-monitor/SystemMetricsCards';
import { ConfidenceDistributionChart } from './biometric-monitor/ConfidenceDistributionChart';
import { UserSelectionPanel } from './biometric-monitor/UserSelectionPanel';
import { UserProfileAnalysisCard } from './biometric-monitor/UserProfileAnalysis';
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
          <UserProfileAnalysisCard analysis={selectedUserAnalysis} />
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
