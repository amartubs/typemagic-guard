
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Code, Users, BarChart } from 'lucide-react';
import Header from '@/components/layout/Header';
import ProspectDemo from '@/components/demo/ProspectDemo';
import SEOHead from '@/components/seo/SEOHead';
import ConversionTracker from '@/components/optimization/ConversionTracker';

const DemoEnvironment = () => {
  return (
    <ConversionTracker>
      <div className="min-h-screen flex flex-col">
        <SEOHead
          title="Interactive Demo - Shoale Keystroke Biometrics"
          description="Experience keystroke biometric authentication in action. See how our invisible security layer protects your applications."
          keywords={['demo', 'keystroke biometrics', 'interactive demo', 'security demonstration']}
        />
        
        <Header />

        <main className="flex-grow">
          <section className="py-12 bg-gradient-to-b from-[#E5DEFF] to-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                  Experience Keystroke Biometrics
                  <span className="text-[#9b87f5] block mt-2">In Action</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  See how our invisible security layer analyzes typing patterns to authenticate users 
                  and prevent fraud in real-time.
                </p>
              </div>

              <Tabs defaultValue="interactive" className="w-full">
                <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
                  <TabsTrigger value="interactive" className="flex items-center space-x-2">
                    <Play size={16} />
                    <span>Interactive</span>
                  </TabsTrigger>
                  <TabsTrigger value="integration" className="flex items-center space-x-2">
                    <Code size={16} />
                    <span>Integration</span>
                  </TabsTrigger>
                  <TabsTrigger value="use-cases" className="flex items-center space-x-2">
                    <Users size={16} />
                    <span>Use Cases</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center space-x-2">
                    <BarChart size={16} />
                    <span>Analytics</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="interactive" className="mt-8">
                  <ProspectDemo />
                </TabsContent>

                <TabsContent value="integration" className="mt-8">
                  <div className="max-w-4xl mx-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Integration Examples</CardTitle>
                        <CardDescription>
                          See how easy it is to add keystroke biometrics to your application
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-semibold mb-2">JavaScript SDK</h3>
                            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">
                              <div className="text-green-400">// Install the SDK</div>
                              <div>npm install @shoale/keystroke-sdk</div>
                              <br />
                              <div className="text-green-400">// Initialize</div>
                              <div>const shoale = new Shoale(apiKey);</div>
                              <br />
                              <div className="text-green-400">// Track keystrokes</div>
                              <div>shoale.track(inputElement);</div>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">REST API</h3>
                            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">
                              <div className="text-blue-400">POST</div>
                              <div>/api/v1/authenticate</div>
                              <br />
                              <div className="text-yellow-400">Headers:</div>
                              <div>Authorization: Bearer {'{api_key}'}</div>
                              <br />
                              <div className="text-yellow-400">Body:</div>
                              <div>{'{user_id, keystroke_data}'}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="use-cases" className="mt-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        {
                          title: 'Financial Services',
                          description: 'Prevent account takeovers and fraudulent transactions',
                          badge: 'Banking',
                          color: 'bg-blue-50 border-blue-200'
                        },
                        {
                          title: 'Healthcare',
                          description: 'Secure patient data access and HIPAA compliance',
                          badge: 'Healthcare',
                          color: 'bg-green-50 border-green-200'
                        },
                        {
                          title: 'E-commerce',
                          description: 'Reduce payment fraud and protect customer accounts',
                          badge: 'Retail',
                          color: 'bg-purple-50 border-purple-200'
                        },
                        {
                          title: 'Enterprise',
                          description: 'Secure employee access to sensitive systems',
                          badge: 'Corporate',
                          color: 'bg-orange-50 border-orange-200'
                        },
                        {
                          title: 'Education',
                          description: 'Prevent cheating and secure online assessments',
                          badge: 'EdTech',
                          color: 'bg-red-50 border-red-200'
                        },
                        {
                          title: 'Government',
                          description: 'Protect citizen data and critical infrastructure',
                          badge: 'GovTech',
                          color: 'bg-gray-50 border-gray-200'
                        }
                      ].map((useCase, index) => (
                        <Card key={index} className={useCase.color}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{useCase.title}</CardTitle>
                              <Badge variant="secondary">{useCase.badge}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription>{useCase.description}</CardDescription>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-8">
                  <div className="max-w-4xl mx-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle>Real-time Analytics Dashboard</CardTitle>
                        <CardDescription>
                          Monitor authentication patterns and security events
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-4 mb-6">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">99.2%</div>
                            <p className="text-sm text-muted-foreground">Authentication Success</p>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">0.8%</div>
                            <p className="text-sm text-muted-foreground">False Positive Rate</p>
                          </div>
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">847</div>
                            <p className="text-sm text-muted-foreground">Fraud Attempts Blocked</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">127ms</div>
                            <p className="text-sm text-muted-foreground">Average Response Time</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <Button className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                            View Full Dashboard
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          <section className="py-16 bg-[#E5DEFF]/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to integrate?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start protecting your users with invisible keystroke biometric authentication today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-[#9b87f5] text-[#9b87f5]">
                  Schedule Demo Call
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </ConversionTracker>
  );
};

export default DemoEnvironment;
