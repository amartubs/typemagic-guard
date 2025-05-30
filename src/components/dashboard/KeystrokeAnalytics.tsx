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

interface KeystrokeAnalyticsProps {
  condensed?: boolean;
}

const KeystrokeAnalytics: React.FC<KeystrokeAnalyticsProps> = ({ condensed = false }) => {
  const { canAccessFeature } = useSubscription();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // Mock data for demonstration
  const [mockData, setMockData] = useState({
    confidenceHistory: [
      { date: "May 24", confidence: 85 },
      { date: "May 25", confidence: 88 },
      { date: "May 26", confidence: 90 },
      { date: "May 27", confidence: 91 },
      { date: "May 28", confidence: 89 },
      { date: "May 29", confidence: 92 },
      { date: "May 30", confidence: 94 },
    ],
    typingPatterns: [
      {
        key: "KeyA",
        pressTime: 98,
        releaseTime: 65,
        similarity: 92,
      },
      {
        key: "KeyS",
        pressTime: 105,
        releaseTime: 72,
        similarity: 88,
      },
      {
        key: "KeyD",
        pressTime: 95,
        releaseTime: 68,
        similarity: 95,
      },
      {
        key: "KeyF",
        pressTime: 102,
        releaseTime: 70,
        similarity: 91,
      },
      {
        key: "Space",
        pressTime: 110,
        releaseTime: 75,
        similarity: 86,
      },
    ],
  });

  if (loading) {
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
              data={mockData.confidenceHistory}
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
            <div className="text-3xl font-bold text-primary">94%</div>
            <div className="text-sm text-muted-foreground">
              Current authentication confidence
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
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
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
                    data={mockData.confidenceHistory}
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
                    data={mockData.typingPatterns}
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
                    data={mockData.typingPatterns}
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
                      {mockData.typingPatterns.map((entry, index) => (
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
