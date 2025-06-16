
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface KeystrokeAnalyticsProps {
  condensed?: boolean;
}

const KeystrokeAnalytics: React.FC<KeystrokeAnalyticsProps> = ({ condensed = false }) => {
  const { canAccessFeature } = useSubscription();
  const { user } = useAuth();

  const { data: biometricData, isLoading } = useQuery({
    queryKey: ['keystroke-analytics', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Fetch biometric profile
      const { data: profile } = await supabase
        .from('biometric_profiles')
        .select('confidence_score, status, last_updated')
        .eq('user_id', user.id)
        .single();

      // Fetch recent authentication attempts for confidence history
      const { data: attempts } = await supabase
        .from('authentication_attempts')
        .select('confidence_score, created_at, success')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Generate confidence history from attempts
      const confidenceHistory = attempts?.map((attempt, index) => ({
        date: new Date(attempt.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        confidence: attempt.confidence_score || 0
      })).reverse() || [];

      // Add current confidence if we have a profile
      if (profile && confidenceHistory.length > 0) {
        confidenceHistory[confidenceHistory.length - 1].confidence = profile.confidence_score;
      }

      // Mock typing patterns data (would come from actual keystroke analysis)
      const typingPatterns = [
        { key: "KeyA", pressTime: 98, releaseTime: 65, similarity: profile?.confidence_score || 92 },
        { key: "KeyS", pressTime: 105, releaseTime: 72, similarity: Math.max(0, (profile?.confidence_score || 88) - 4) },
        { key: "KeyD", pressTime: 95, releaseTime: 68, similarity: Math.min(100, (profile?.confidence_score || 95) + 3) },
        { key: "KeyF", pressTime: 102, releaseTime: 70, similarity: profile?.confidence_score || 91 },
        { key: "Space", pressTime: 110, releaseTime: 75, similarity: Math.max(0, (profile?.confidence_score || 86) - 6) },
      ];

      return {
        confidenceHistory: confidenceHistory.length > 0 ? confidenceHistory : [
          { date: "Today", confidence: profile?.confidence_score || 0 }
        ],
        typingPatterns,
        currentConfidence: profile?.confidence_score || 0,
        status: profile?.status || 'learning'
      };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (condensed) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Keystroke Authentication</CardTitle>
          <CardDescription>
            Your typing pattern confidence over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={biometricData?.confidenceHistory || []}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <div className="text-3xl font-bold text-primary">{biometricData?.currentConfidence || 0}%</div>
            <div className="text-sm text-muted-foreground">
              Current authentication confidence
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Status: {biometricData?.status || 'learning'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="confidence" className="space-y-4">
        <TabsList>
          <TabsTrigger value="confidence">Confidence History</TabsTrigger>
          <TabsTrigger value="patterns">Typing Patterns</TabsTrigger>
          <TabsTrigger value="anomalies">Pattern Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="confidence">
          <Card>
            <CardHeader>
              <CardTitle>Confidence Score History</CardTitle>
              <CardDescription>
                Your pattern recognition confidence over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={biometricData?.confidenceHistory || []}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="confidence"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Key Press Pattern Analysis</CardTitle>
              <CardDescription>
                Timing and pressure analysis of your typing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={biometricData?.typingPatterns || []}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="key" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="pressTime"
                      name="Press Time (ms)"
                      fill="#8884d8"
                    />
                    <Bar
                      dataKey="releaseTime"
                      name="Release Time (ms)"
                      fill="#82ca9d"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="anomalies">
          <Card>
            <CardHeader>
              <CardTitle>Pattern Similarity</CardTitle>
              <CardDescription>
                How closely your typing matches your stored profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={biometricData?.typingPatterns || []}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="key" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="similarity" name="Similarity (%)">
                      {(biometricData?.typingPatterns || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.similarity > 90
                              ? "#82ca9d"
                              : entry.similarity > 80
                              ? "#ffc658"
                              : "#ff8042"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeystrokeAnalytics;
