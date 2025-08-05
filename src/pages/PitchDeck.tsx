import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Zap, 
  Globe, 
  Award,
  Building,
  Cpu,
  Lock,
  BarChart3,
  Rocket,
  CheckCircle
} from 'lucide-react';

const PitchDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Title
    {
      title: "Shoale",
      subtitle: "Next-Generation Biometric Authentication",
      content: (
        <div className="text-center space-y-8">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
            <Shield className="w-16 h-16 text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Shoale
            </h1>
            <p className="text-2xl text-muted-foreground">
              Behavioral Biometrics for Zero-Friction Security
            </p>
            <p className="text-lg text-muted-foreground">
              Series A Funding • $5M Round
            </p>
          </div>
        </div>
      )
    },

    // Slide 2: Problem
    {
      title: "The $6 Billion Problem",
      subtitle: "Traditional Authentication is Broken",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Target className="w-5 h-5" />
                  $6B Annual Losses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Account takeover fraud costs businesses $6 billion annually, with 22% growth year-over-year.</p>
              </CardContent>
            </Card>
            
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Users className="w-5 h-5" />
                  81% of Breaches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Password-related breaches account for 81% of hacking incidents. Users reuse passwords across 14+ sites.</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Current Solutions Fall Short</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-medium text-destructive">Passwords</h4>
                <p className="text-sm text-muted-foreground">Easily compromised, forgotten, reused</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-medium text-destructive">2FA/SMS</h4>
                <p className="text-sm text-muted-foreground">SIM swapping, friction, abandonment</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-medium text-destructive">Hardware Tokens</h4>
                <p className="text-sm text-muted-foreground">Expensive, lost, poor UX</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: Solution
    {
      title: "Our Solution",
      subtitle: "Invisible, Continuous, Unbreakable",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Behavioral Biometric Authentication</h3>
            <p className="text-lg text-muted-foreground">
              Shoale analyzes how users type, move their mouse, and interact with devices to create unique biometric profiles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Zero Friction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Users authenticate simply by typing naturally. No passwords, no tokens, no delays.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Continuous Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Real-time monitoring detects account takeovers within seconds of suspicious activity.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Machine learning continuously adapts to user behavior patterns with 99.7% accuracy.</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-secondary/50 p-6 rounded-lg">
            <h4 className="font-semibold mb-2">Key Differentiators</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>✓ Works on any device, any platform</div>
              <div>✓ Privacy-first, GDPR compliant</div>
              <div>✓ 5-minute integration</div>
              <div>✓ 99.97% uptime SLA</div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: Market Opportunity
    {
      title: "Market Opportunity",
      subtitle: "$31B TAM Growing at 15% CAGR",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-3xl font-bold text-primary">$31B</div>
                  <div className="text-sm text-muted-foreground">Total Addressable Market</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-sm">Global identity verification market by 2028</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-3xl font-bold text-primary">$12B</div>
                  <div className="text-sm text-muted-foreground">Serviceable Addressable Market</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-sm">Behavioral biometrics and continuous auth</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-3xl font-bold text-primary">$800M</div>
                  <div className="text-sm text-muted-foregroundtract">Serviceable Obtainable Market</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-sm">Our realistic 5-year market capture</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Market Drivers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="secondary">Regulatory Pressure</Badge>
                <p className="text-sm">PSD2, GDPR, SOX compliance requirements driving adoption</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary">Remote Work</Badge>
                <p className="text-sm">300% increase in remote access needs post-COVID</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary">Digital Transformation</Badge>
                <p className="text-sm">95% of organizations prioritizing digital identity</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary">Cost of Fraud</Badge>
                <p className="text-sm">Average breach cost: $4.45M and rising 15% annually</p>
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Target Segments</h4>
            <div className="flex flex-wrap gap-2">
              <Badge>Financial Services ($8B)</Badge>
              <Badge>Healthcare ($4B)</Badge>
              <Badge>Government ($3B)</Badge>
              <Badge>Enterprise SaaS ($6B)</Badge>
              <Badge>E-commerce ($5B)</Badge>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Product Demo
    {
      title: "Product Demo",
      subtitle: "See Shoale in Action",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">3-Step Integration Process</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="text-center">
                  <div className="mx-auto w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">1</div>
                  <CardTitle>Install SDK</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded text-xs font-mono">
                  npm install @shoale/auth
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-center">
                  <div className="mx-auto w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">2</div>
                  <CardTitle>Initialize</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded text-xs font-mono">
                  Shoale.init(apiKey)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-center">
                  <div className="mx-auto w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">3</div>
                  <CardTitle>Go Live</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded text-xs font-mono">
                  Production ready!
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Keystroke Pattern Match</span>
                    <span className="text-green-600 font-semibold">98.7%</span>
                  </div>
                  <Progress value={98.7} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mouse Dynamics</span>
                    <span className="text-green-600 font-semibold">96.2%</span>
                  </div>
                  <Progress value={96.2} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Device Fingerprint</span>
                    <span className="text-green-600 font-semibold">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Overall Confidence</span>
                    <span className="text-green-600">97.8% - AUTHENTICATED</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },

    // Slide 6: Business Model
    {
      title: "Business Model",
      subtitle: "Scalable SaaS with Enterprise Focus",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <Building className="w-8 h-8 mx-auto mb-2 text-primary" />
                  Developer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="text-2xl font-bold">$0.10</div>
                <div className="text-sm text-muted-foreground">per authentication</div>
                <div className="text-xs">Pay-as-you-scale</div>
                <Badge variant="outline">Free tier: 1,000 auths/month</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  Business
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="text-2xl font-bold">$5-50</div>
                <div className="text-sm text-muted-foreground">per user/month</div>
                <div className="text-xs">Advanced features</div>
                <Badge variant="outline">Analytics, SSO, Support</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  <Globe className="w-8 h-8 mx-auto mb-2 text-primary" />
                  Enterprise
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="text-2xl font-bold">$100K+</div>
                <div className="text-sm text-muted-foreground">annual contracts</div>
                <div className="text-xs">Custom deployment</div>
                <Badge variant="outline">On-premise, White-label</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Streams</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>API Usage (40%)</span>
                  <span>$2.8M ARR</span>
                </div>
                <div className="flex justify-between">
                  <span>SaaS Subscriptions (45%)</span>
                  <span>$3.2M ARR</span>
                </div>
                <div className="flex justify-between">
                  <span>Enterprise Licenses (15%)</span>
                  <span>$1.1M ARR</span>
                </div>
                <div className="pt-2 border-t font-semibold">
                  <div className="flex justify-between">
                    <span>Total ARR</span>
                    <span>$7.1M</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Unit Economics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Average Contract Value</span>
                  <span>$24,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Acquisition Cost</span>
                  <span>$3,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Margin</span>
                  <span>87%</span>
                </div>
                <div className="flex justify-between">
                  <span>LTV/CAC Ratio</span>
                  <span>8.2x</span>
                </div>
                <div className="flex justify-between">
                  <span>Payback Period</span>
                  <span>11 months</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-secondary/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Path to $100M ARR</h4>
            <div className="grid grid-cols-4 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold">Year 2</div>
                <div>$15M ARR</div>
              </div>
              <div>
                <div className="font-semibold">Year 3</div>
                <div>$35M ARR</div>
              </div>
              <div>
                <div className="font-semibold">Year 4</div>
                <div>$65M ARR</div>
              </div>
              <div>
                <div className="font-semibold">Year 5</div>
                <div>$100M ARR</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: Traction
    {
      title: "Traction & Growth",
      subtitle: "Proven Product-Market Fit",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">147</div>
                <div className="text-sm text-muted-foreground">Paying Customers</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">$7.1M</div>
                <div className="text-sm text-muted-foreground">Annual Recurring Revenue</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">312%</div>
                <div className="text-sm text-muted-foreground">Net Revenue Retention</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">2.1M</div>
                <div className="text-sm text-muted-foreground">Monthly Authentications</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Logos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Badge variant="outline" className="justify-center">TechBank</Badge>
                  <Badge variant="outline" className="justify-center">HealthCorp</Badge>
                  <Badge variant="outline" className="justify-center">EduSoft</Badge>
                  <Badge variant="outline" className="justify-center">RetailPlus</Badge>
                  <Badge variant="outline" className="justify-center">GovTech</Badge>
                  <Badge variant="outline" className="justify-center">InsureCo</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Including Fortune 500 financial services, healthcare, and government agencies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Monthly Growth Rate</span>
                  <span className="text-green-600 font-semibold">23%</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Churn (Monthly)</span>
                  <span className="text-green-600 font-semibold">0.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Time to Value</span>
                  <span className="text-green-600 font-semibold">5 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>API Uptime</span>
                  <span className="text-green-600 font-semibold">99.97%</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Satisfaction</span>
                  <span className="text-green-600 font-semibold">4.8/5</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <blockquote className="border-l-4 border-primary pl-4 italic">
                  "Reduced fraud by 94% while eliminating password resets. ROI in 3 months."
                  <footer className="text-sm text-muted-foreground mt-2">- CISO, Fortune 100 Bank</footer>
                </blockquote>
                <blockquote className="border-l-4 border-primary pl-4 italic">
                  "Seamless integration, zero user complaints. Best security investment we've made."
                  <footer className="text-sm text-muted-foreground mt-2">- CTO, Healthcare Platform</footer>
                </blockquote>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },

    // Slide 8: Competition
    {
      title: "Competitive Landscape",
      subtitle: "Clear Differentiation & Moat",
      content: (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-left">Feature</th>
                  <th className="border border-border p-3 text-center bg-primary/10">Shoale</th>
                  <th className="border border-border p-3 text-center">BioCatch</th>
                  <th className="border border-border p-3 text-center">Okta</th>
                  <th className="border border-border p-3 text-center">Microsoft</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">Keystroke Dynamics</td>
                  <td className="border border-border p-3 text-center">✓</td>
                  <td className="border border-border p-3 text-center">✓</td>
                  <td className="border border-border p-3 text-center">✗</td>
                  <td className="border border-border p-3 text-center">✗</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Continuous Monitoring</td>
                  <td className="border border-border p-3 text-center">✓</td>
                  <td className="border border-border p-3 text-center">✓</td>
                  <td className="border border-border p-3 text-center">Limited</td>
                  <td className="border border-border p-3 text-center">Limited</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">5-Minute Integration</td>
                  <td className="border border-border p-3 text-center">✓</td>
                  <td className="border border-border p-3 text-center">✗</td>
                  <td className="border border-border p-3 text-center">✗</td>
                  <td className="border border-border p-3 text-center">✗</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Privacy-First</td>
                  <td className="border border-border p-3 text-center">✓</td>
                  <td className="border border-border p-3 text-center">Limited</td>
                  <td className="border border-border p-3 text-center">✗</td>
                  <td className="border border-border p-3 text-center">✗</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Developer-First API</td>
                  <td className="border border-border p-3 text-center">✓</td>
                  <td className="border border-border p-3 text-center">Limited</td>
                  <td className="border border-border p-3 text-center">✓</td>
                  <td className="border border-border p-3 text-center">Limited</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Cost per Auth</td>
                  <td className="border border-border p-3 text-center">$0.10</td>
                  <td className="border border-border p-3 text-center">$0.50</td>
                  <td className="border border-border p-3 text-center">$2.00</td>
                  <td className="border border-border p-3 text-center">$1.50</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Our Competitive Advantages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">80% lower implementation cost</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">5x faster time to value</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Patent-pending ML algorithms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Edge processing for privacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Developer-first approach</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Implementation Speed</span>
                      <span className="text-sm font-semibold">Leader</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Developer Experience</span>
                      <span className="text-sm font-semibold">Leader</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Cost Effectiveness</span>
                      <span className="text-sm font-semibold">Leader</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 9: Team
    {
      title: "World-Class Team",
      subtitle: "Deep Domain Expertise",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="text-center pt-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">JS</span>
                </div>
                <h3 className="font-semibold">Jane Smith</h3>
                <p className="text-sm text-muted-foreground">CEO & Co-Founder</p>
                <p className="text-xs mt-2">Former VP Engineering at Stripe. 15 years in security. Stanford CS.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center pt-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">MD</span>
                </div>
                <h3 className="font-semibold">Mike Davis</h3>
                <p className="text-sm text-muted-foreground">CTO & Co-Founder</p>
                <p className="text-xs mt-2">Ex-Google Security team. PhD ML from MIT. 10 patents in biometrics.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center pt-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AK</span>
                </div>
                <h3 className="font-semibold">Alex Kim</h3>
                <p className="text-sm text-muted-foreground">VP of Sales</p>
                <p className="text-xs mt-2">Former Okta Enterprise. Built $50M ARR division. 12 years B2B sales.</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Hires (Last 12 Months)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>• Head of Product (ex-Microsoft Azure)</div>
                <div>• Head of Marketing (ex-Cloudflare)</div>
                <div>• Principal Engineer (ex-Apple Security)</div>
                <div>• VP Customer Success (ex-Twilio)</div>
                <div>• Lead Data Scientist (ex-Netflix)</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advisory Board</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>• Former CISO, Goldman Sachs</div>
                <div>• Ex-VP Product, Okta</div>
                <div>• Former Head of Security, Uber</div>
                <div>• Ex-Partner, Andreessen Horowitz</div>
                <div>• Former CTO, Stripe</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">47</div>
                  <div className="text-sm text-muted-foreground">Total Employees</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">28</div>
                  <div className="text-sm text-muted-foreground">Engineers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">89%</div>
                  <div className="text-sm text-muted-foreground">Retention Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">15</div>
                  <div className="text-sm text-muted-foreground">Patents Filed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },

    // Slide 10: Financials
    {
      title: "Financial Projections",
      subtitle: "Path to Profitability",
      content: (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-left">Metric</th>
                  <th className="border border-border p-3 text-center">2024</th>
                  <th className="border border-border p-3 text-center">2025</th>
                  <th className="border border-border p-3 text-center">2026</th>
                  <th className="border border-border p-3 text-center">2027</th>
                  <th className="border border-border p-3 text-center">2028</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 font-semibold">Revenue ($M)</td>
                  <td className="border border-border p-3 text-center">7.1</td>
                  <td className="border border-border p-3 text-center">15.2</td>
                  <td className="border border-border p-3 text-center">35.8</td>
                  <td className="border border-border p-3 text-center">68.5</td>
                  <td className="border border-border p-3 text-center">105.3</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Gross Margin %</td>
                  <td className="border border-border p-3 text-center">87%</td>
                  <td className="border border-border p-3 text-center">89%</td>
                  <td className="border border-border p-3 text-center">91%</td>
                  <td className="border border-border p-3 text-center">92%</td>
                  <td className="border border-border p-3 text-center">93%</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Operating Margin %</td>
                  <td className="border border-border p-3 text-center">-15%</td>
                  <td className="border border-border p-3 text-center">-8%</td>
                  <td className="border border-border p-3 text-center">12%</td>
                  <td className="border border-border p-3 text-center">23%</td>
                  <td className="border border-border p-3 text-center">28%</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Customers</td>
                  <td className="border border-border p-3 text-center">147</td>
                  <td className="border border-border p-3 text-center">285</td>
                  <td className="border border-border p-3 text-center">520</td>
                  <td className="border border-border p-3 text-center">890</td>
                  <td className="border border-border p-3 text-center">1,250</td>
                </tr>
                <tr>
                  <td className="border border-border p-3">Employees</td>
                  <td className="border border-border p-3 text-center">47</td>
                  <td className="border border-border p-3 text-center">72</td>
                  <td className="border border-border p-3 text-center">125</td>
                  <td className="border border-border p-3 text-center">185</td>
                  <td className="border border-border p-3 text-center">245</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Drivers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">New Customer Acquisition</span>
                    <span className="text-sm">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Upsell/Cross-sell</span>
                    <span className="text-sm">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Price Increases</span>
                    <span className="text-sm">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Assumptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>• 15% monthly growth rate (Years 1-2)</div>
                <div>• 25% annual price increases</div>
                <div>• 95%+ gross margins at scale</div>
                <div>• 1.2% monthly churn rate</div>
                <div>• $25K average contract value</div>
                <div>• 8:1 LTV/CAC ratio maintained</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Funding History & Valuation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">Seed (2022)</div>
                  <div className="text-2xl font-bold text-primary">$2M</div>
                  <div className="text-sm text-muted-foreground">$8M pre-money</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">Series A (2024)</div>
                  <div className="text-2xl font-bold text-primary">$5M</div>
                  <div className="text-sm text-muted-foreground">$45M pre-money</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">Current ARR Multiple</div>
                  <div className="text-2xl font-bold text-primary">7.1x</div>
                  <div className="text-sm text-muted-foreground">vs. 12x public comps</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },

    // Slide 11: Funding Ask
    {
      title: "Funding Ask",
      subtitle: "$5M Series A to Scale Go-to-Market",
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">$5,000,000 Series A</CardTitle>
              <p className="text-center text-muted-foreground">18-month runway to $25M ARR</p>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Use of Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sales & Marketing (60%)</span>
                    <span className="font-semibold">$3.0M</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">
                    • 15 sales reps & 8 marketing specialists<br/>
                    • Enterprise sales training & tools<br/>
                    • Demand generation & events
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Product & Engineering (25%)</span>
                    <span className="font-semibold">$1.25M</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">
                    • 8 additional engineers<br/>
                    • Advanced ML capabilities<br/>
                    • Enterprise features & security
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Operations & Infrastructure (15%)</span>
                    <span className="font-semibold">$750K</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">
                    • Customer success team<br/>
                    • Cloud infrastructure scaling<br/>
                    • Compliance & security audits
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>18-Month Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm">$25M ARR (3.5x growth)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm">500+ enterprise customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm">Break-even on operations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm">International expansion (EU)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm">SOC 2 Type II certification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-primary" />
                  <span className="text-sm">Series B readiness ($50M round)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Investment Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Pre-Money Valuation</div>
                  <div className="text-2xl font-bold text-primary">$45M</div>
                  <div className="text-xs text-muted-foreground">6.3x current ARR</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Post-Money Valuation</div>
                  <div className="text-2xl font-bold text-primary">$50M</div>
                  <div className="text-xs text-muted-foreground">10% dilution</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Security Type</div>
                  <div className="text-2xl font-bold text-primary">Preferred</div>
                  <div className="text-xs text-muted-foreground">Participating, 1x liquidation</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-secondary/50 p-6 rounded-lg text-center">
            <h4 className="font-semibold mb-2">Investor Profile</h4>
            <p className="text-sm text-muted-foreground">
              Seeking lead investor with enterprise software expertise, 
              strong network in financial services, and track record of scaling $100M+ ARR companies
            </p>
          </div>
        </div>
      )
    },

    // Slide 12: Call to Action
    {
      title: "Join Us",
      subtitle: "Building the Future of Authentication",
      content: (
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">
              The Password is <span className="text-destructive line-through">Dead</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Help us build a world where security is invisible, seamless, and unbreakable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Rocket className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">$31B Market</h3>
                <p className="text-sm text-muted-foreground">Massive opportunity in identity verification</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Proven Traction</h3>
                <p className="text-sm text-muted-foreground">$7.1M ARR, 312% net retention</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Category Leader</h3>
                <p className="text-sm text-muted-foreground">First-mover advantage in behavioral biometrics</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Ready to Eliminate Passwords Forever?</h3>
            <div className="space-y-2">
              <p className="text-lg">jane@shoale.com • +1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground">Let's schedule a demo and discuss partnership opportunities</p>
            </div>
          </div>

          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold">5 min</div>
                  <div className="text-xs text-muted-foreground">Integration Time</div>
                </div>
                <div>
                  <div className="text-lg font-bold">99.7%</div>
                  <div className="text-xs text-muted-foregroundntil5 -9">Accuracy</div>
                </div>
                <div>
                  <div className="text-lg font-bold">94%</div>
                  <div className="text-xs text-muted-foreground">Fraud Reduction</div>
                </div>
                <div>
                  <div className="text-lg font-bold">3 months</div>
                  <div className="text-xs text-muted-foreground">ROI Timeline</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Shoale Investor Pitch</h1>
            <Badge variant="outline">
              {currentSlide + 1} of {slides.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevSlide} disabled={currentSlide === 0}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={(currentSlide / (slides.length - 1)) * 100} className="h-2" />
        </div>

        {/* Slide Content */}
        <Card className="min-h-[600px]">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">{slides[currentSlide].title}</CardTitle>
            {slides[currentSlide].subtitle && (
              <p className="text-xl text-muted-foreground">{slides[currentSlide].subtitle}</p>
            )}
          </CardHeader>
          <CardContent className="p-8">
            {slides[currentSlide].content}
          </CardContent>
        </Card>

        {/* Slide Navigation */}
        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Keyboard Instructions */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Use arrow keys or click buttons to navigate • Press ESC for slide overview
        </div>
      </div>
    </div>
  );
};

export default PitchDeck;