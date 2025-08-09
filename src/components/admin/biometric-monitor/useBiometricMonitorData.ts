
import { useState, useEffect } from 'react';
import { AdvancedBiometricAnalyzer } from '@/lib/biometric/advancedAnalyzer';
import { ContinuousLearningEngine } from '@/lib/biometric/continuousLearning';
import { BiometricProfile, KeystrokePattern, KeyTiming } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { BiometricEncryption } from '@/lib/security/encryption';

export interface UserProfileAnalysis {
  userId: string;
  userEmail: string;
  profile: BiometricProfile;
  metrics: any;
  fraudIndicators: any;
  learningMetrics: any;
  riskScore: number;
}

export interface SystemMetrics {
  totalProfiles: number;
  averageConfidence: number;
  fraudDetectionRate: number;
  learningProfiles: number;
  activeProfiles: number;
  lockedProfiles: number;
}

export const useBiometricMonitorData = () => {
  const [userAnalyses, setUserAnalyses] = useState<UserProfileAnalysis[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBiometricData();
  }, []);

  const loadBiometricData = async () => {
    try {
      setLoading(true);
      console.log('Loading biometric data...');
      
      const { data: profiles, error } = await supabase
        .from('biometric_profiles')
        .select(`
          *,
          profiles!biometric_profiles_user_id_fkey(id, email, name),
          keystroke_patterns!keystroke_patterns_biometric_profile_id_fkey(*)
        `);

      if (error) {
        console.error('Error loading biometric profiles:', error);
        return;
      }

      console.log('Loaded profiles:', profiles);

      if (!profiles || profiles.length === 0) {
        console.log('No biometric profiles found');
        setUserAnalyses([]);
        setSystemMetrics({
          totalProfiles: 0,
          averageConfidence: 0,
          fraudDetectionRate: 0,
          learningProfiles: 0,
          activeProfiles: 0,
          lockedProfiles: 0
        });
        return;
      }

      const analyses: UserProfileAnalysis[] = [];
      
      for (const dbProfile of profiles) {
        console.log('Processing profile:', dbProfile);
        
        if (!dbProfile.profiles?.email) {
          console.log('Skipping profile without user email:', dbProfile.user_id);
          continue;
        }
        
        const patterns: KeystrokePattern[] = [];
        if (dbProfile.keystroke_patterns?.length) {
          const decryptedPatterns = await Promise.all(
            dbProfile.keystroke_patterns.map(async (kp: any) => {
              let timings: KeyTiming[] = [];
              try {
                if (kp.pattern_data?.encrypted) {
                  const decrypted = await BiometricEncryption.decryptBiometricData(kp.pattern_data.encrypted);
                  timings = decrypted as KeyTiming[];
                } else if (kp.pattern_data?.timings) {
                  timings = kp.pattern_data.timings as KeyTiming[];
                }
              } catch (e) {
                console.warn('Failed to decrypt keystroke pattern', kp.id, e);
              }
              return {
                userId: dbProfile.user_id,
                patternId: kp.id,
                timings,
                timestamp: new Date(kp.created_at).getTime(),
                context: kp.context || 'unknown'
              } as KeystrokePattern;
            })
          );
          patterns.push(...decryptedPatterns);
        }

        const profile: BiometricProfile = {
          userId: dbProfile.user_id,
          keystrokePatterns: patterns,
          confidenceScore: dbProfile.confidence_score || 0,
          lastUpdated: new Date(dbProfile.last_updated).getTime(),
          status: dbProfile.status || 'learning'
        };

        console.log('Reconstructed profile for user:', profile.userId, 'patterns:', profile.keystrokePatterns.length);

        // Use the most recent real pattern for analysis when available
        const latestPattern: KeystrokePattern = profile.keystrokePatterns.length > 0 ?
          profile.keystrokePatterns[profile.keystrokePatterns.length - 1] :
          {
            userId: profile.userId,
            patternId: 'no-pattern',
            timings: [],
            timestamp: Date.now(),
            context: 'analysis'
          };

        const analysisResult = AdvancedBiometricAnalyzer.analyzePatternWithFraudDetection(
          profile,
          latestPattern
        );

        const learningMetrics = ContinuousLearningEngine.calculateLearningMetrics(profile);
        
        let riskScore = 0;
        if (analysisResult.fraudIndicators.machineGeneratedPattern) riskScore += 40;
        if (analysisResult.fraudIndicators.suspiciousTimingPatterns) riskScore += 30;
        if (analysisResult.fraudIndicators.copyPasteDetected) riskScore += 20;
        if (profile.confidenceScore < 50) riskScore += 20;
        if (profile.status === 'locked') riskScore += 50;
        
        const userAnalysis: UserProfileAnalysis = {
          userId: profile.userId,
          userEmail: dbProfile.profiles.email,
          profile,
          metrics: analysisResult.metrics,
          fraudIndicators: analysisResult.fraudIndicators,
          learningMetrics,
          riskScore: Math.min(100, riskScore)
        };
        
        analyses.push(userAnalysis);
        console.log('Added analysis for user:', userAnalysis.userEmail);
      }

      console.log('Total analyses created:', analyses.length);
      setUserAnalyses(analyses);
      
      if (analyses.length > 0) {
        const systemMetrics: SystemMetrics = {
          totalProfiles: analyses.length,
          averageConfidence: analyses.reduce((sum, a) => sum + a.profile.confidenceScore, 0) / analyses.length,
          fraudDetectionRate: (analyses.filter(a => 
            a.fraudIndicators.machineGeneratedPattern || 
            a.fraudIndicators.suspiciousTimingPatterns
          ).length / analyses.length) * 100,
          learningProfiles: analyses.filter(a => a.profile.status === 'learning').length,
          activeProfiles: analyses.filter(a => a.profile.status === 'active').length,
          lockedProfiles: analyses.filter(a => a.profile.status === 'locked').length
        };
        setSystemMetrics(systemMetrics);
      } else {
        setSystemMetrics({
          totalProfiles: 0,
          averageConfidence: 0,
          fraudDetectionRate: 0,
          learningProfiles: 0,
          activeProfiles: 0,
          lockedProfiles: 0
        });
      }
      
    } catch (error) {
      console.error('Error loading biometric data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    loadBiometricData();
  };

  return {
    userAnalyses,
    systemMetrics,
    loading,
    refreshing,
    refreshData
  };
};
