import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { EducationSecurityEngine } from '@/lib/security/educationSecurityEngine';
import { ExamProctoring, StudentIdentityVerification, AcademicIntegrityMonitor } from '@/types/advancedSecurity';
import { useAuth } from '@/contexts/auth';

export const EducationSecurityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [examSessions, setExamSessions] = useState<ExamProctoring[]>([]);
  const [verifications, setVerifications] = useState<StudentIdentityVerification[]>([]);
  const [integrityMonitors, setIntegrityMonitors] = useState<AcademicIntegrityMonitor[]>([]);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    if (monitoring) {
      const interval = setInterval(() => {
        setExamSessions(EducationSecurityEngine.getAllExamSessions());
        setVerifications(EducationSecurityEngine.getAllVerifications());
        setIntegrityMonitors(EducationSecurityEngine.getAllIntegrityMonitors());
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [monitoring]);

  const startExam = async () => {
    if (!user?.id) return;
    const examId = `exam-${Date.now()}`;
    await EducationSecurityEngine.startExamProctoring(user.id, examId);
    setMonitoring(true);
  };

  const verifyIdentity = async () => {
    if (!user?.id) return;
    await EducationSecurityEngine.verifyStudentIdentity(user.id);
  };

  const startIntegrityMonitor = async () => {
    if (!user?.id) return;
    const courseId = `course-${Date.now()}`;
    await EducationSecurityEngine.initializeIntegrityMonitor(user.id, courseId, 'exam');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Education Security</h2>
          <p className="text-muted-foreground">Privacy-first academic integrity monitoring and exam proctoring</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={startExam} className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Start Exam
          </Button>
          <Button onClick={verifyIdentity} variant="outline">Verify Identity</Button>
          <Button onClick={startIntegrityMonitor} variant="outline">Start Monitor</Button>
        </div>
      </div>

      <Tabs defaultValue="exams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="exams">Exam Proctoring</TabsTrigger>
          <TabsTrigger value="identity">Identity Verification</TabsTrigger>
          <TabsTrigger value="integrity">Academic Integrity</TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="space-y-4">
          {examSessions.map((exam) => (
            <Card key={exam.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Exam: {exam.exam_id}</CardTitle>
                  <Badge variant={exam.integrity_score > 80 ? 'default' : exam.integrity_score > 60 ? 'secondary' : 'destructive'}>
                    Integrity: {exam.integrity_score}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Keystroke Consistency</div>
                    <Progress value={exam.keystroke_pattern_consistency} className="h-2" />
                    <div className="text-xs text-muted-foreground">{exam.keystroke_pattern_consistency.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Cheating Probability</div>
                    <Progress value={exam.cheating_probability} className="h-2" />
                    <div className="text-xs text-muted-foreground">{exam.cheating_probability.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Violations</div>
                    <div className="text-lg font-semibold">{exam.window_focus_violations}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Copy/Paste</div>
                    <div className="text-lg font-semibold">{exam.copy_paste_attempts}</div>
                  </div>
                </div>
                {exam.behavioral_flags.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Behavioral Flags</div>
                    <div className="flex flex-wrap gap-2">
                      {exam.behavioral_flags.slice(0, 3).map((flag, index) => (
                        <Badge key={index} variant="outline">{flag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="identity" className="space-y-4">
          {verifications.map((verification) => (
            <Card key={verification.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Student Verification</CardTitle>
                  <Badge variant={
                    verification.verification_status === 'verified' ? 'default' :
                    verification.verification_status === 'flagged' ? 'secondary' : 'destructive'
                  }>
                    {verification.verification_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Biometric Match</div>
                    <Progress value={verification.enrollment_biometric_match} className="h-2" />
                    <div className="text-xs text-muted-foreground">{verification.enrollment_biometric_match.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Writing Style</div>
                    <Progress value={verification.writing_style_consistency} className="h-2" />
                    <div className="text-xs text-muted-foreground">{verification.writing_style_consistency.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Knowledge Baseline</div>
                    <Progress value={verification.knowledge_baseline_score} className="h-2" />
                    <div className="text-xs text-muted-foreground">{verification.knowledge_baseline_score.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Identity Confidence</div>
                    <Progress value={verification.identity_confidence} className="h-2" />
                    <div className="text-xs text-muted-foreground">{verification.identity_confidence.toFixed(1)}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="integrity" className="space-y-4">
          {integrityMonitors.map((monitor) => (
            <Card key={monitor.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Academic Integrity Monitor</CardTitle>
                  <Badge variant={
                    monitor.risk_assessment === 'minimal' ? 'default' :
                    monitor.risk_assessment === 'low' ? 'secondary' :
                    monitor.risk_assessment === 'medium' ? 'outline' : 'destructive'
                  }>
                    {monitor.risk_assessment} risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Deviation Score</div>
                  <Progress value={monitor.deviation_score} className="h-2" />
                  <div className="text-xs text-muted-foreground">{monitor.deviation_score.toFixed(1)}%</div>
                </div>
                {monitor.integrity_flags.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Integrity Flags</div>
                    <div className="flex flex-wrap gap-2">
                      {monitor.integrity_flags.slice(0, 3).map((flag, index) => (
                        <Badge key={index} variant="outline">{flag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};