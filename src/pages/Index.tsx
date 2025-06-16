
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Key, Shield, Lock, UserCheck, FileCode, BarChart4, Globe, Users, Building } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';
import ValuePropositionTest from '@/components/optimization/ValuePropositionTest';
import ConversionTracker from '@/components/optimization/ConversionTracker';
import UserJourneyVisualization from '@/components/landing/UserJourneyVisualization';
import IntegrationExamples from '@/components/landing/IntegrationExamples';
import CaseStudies from '@/components/landing/CaseStudies';
import PricingContext from '@/components/landing/PricingContext';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { useConversionTracking } from '@/hooks/useConversionTracking';

const features = [
  {
    icon: <Key className="h-6 w-6 text-primary" />,
    title: 'Invisible Authentication',
    description: 'End users type normally - our AI analyzes patterns invisibly',
    link: '/demo'
  },
  {
    icon: <UserCheck className="h-6 w-6 text-primary" />,
    title: 'Continuous Monitoring',
    description: 'Real-time fraud detection throughout the entire session',
    link: '/demo'
  },
  {
    icon: <Lock className="h-6 w-6 text-primary" />,
    title: 'Zero User Friction',
    description: 'No downloads, no extra steps, no user training required',
    link: '/pricing'
  },
  {
    icon: <BarChart4 className="h-6 w-6 text-primary" />,
    title: 'Enterprise Analytics',
    description: 'Detailed security insights and fraud prevention reports',
    link: '/demo'
  },
  {
    icon: <FileCode className="h-6 w-6 text-primary" />,
    title: '5-Minute Integration',
    description: 'Simple SDK - add to any login form with minimal code',
    link: '/support'
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: 'Stop Account Takeovers',
    description: 'Prevents fraud even when passwords are compromised',
    link: '/pricing'
  }
];

const businessTypes = [
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: 'SaaS Platforms',
    description: 'Protect user accounts without changing login flows',
    examples: 'CRM, Project Management, Analytics Tools'
  },
  {
    icon: <Building className="h-8 w-8 text-green-600" />,
    title: 'Financial Services',
    description: 'Meet compliance while maintaining user experience',
    examples: 'Banking, Insurance, Investment Platforms'
  },
  {
    icon: <Users className="h-8 w-8 text-purple-600" />,
    title: 'E-commerce & Retail',
    description: 'Prevent payment fraud and account takeovers',
    examples: 'Online Stores, Marketplaces, Subscription Services'
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Shoale",
  "description": "B2B keystroke biometric authentication API for invisible fraud prevention",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "provider": {
    "@type": "Organization",
    "name": "Shoale"
  }
};

export default function Index() {
  const { logMetrics } = usePerformanceMetrics();
  const { trackGoalConversion } = useConversionTracking();

  useEffect(() => {
    // Log performance metrics after page load
    const timer = setTimeout(() => {
      logMetrics();
    }, 3000);

    return () => clearTimeout(timer);
  }, [logMetrics]);

  const handleGetStartedClick = () => {
    trackGoalConversion('get_started_click', 1);
  };

  return (
    <ConversionTracker>
      <div className="min-h-screen flex flex-col">
        <SEOHead
          title="Shoale - Invisible Keystroke Biometric API | B2B Fraud Prevention"
          description="Add invisible keystroke biometric authentication to your app in minutes. Prevent fraud without user friction. Simple API for developers and businesses."
          keywords={['keystroke biometrics API', 'B2B fraud prevention', 'invisible authentication', 'developer security tools', 'biometric authentication SDK', 'account takeover prevention']}
          schema={structuredData}
          canonical={typeof window !== 'undefined' ? window.location.href : ''}
        />
        
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-b from-[#E5DEFF] to-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="mb-6">
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                    B2B Security API • Free for End Users
                  </span>
                </div>
                <ValuePropositionTest />
                <div className="mt-8 bg-white/80 backdrop-blur rounded-lg p-6 max-w-4xl mx-auto border">
                  <p className="text-lg text-muted-foreground">
                    <strong className="text-foreground">For Businesses & Developers:</strong> Add enterprise-grade fraud prevention to your login forms. 
                    <strong className="text-foreground"> For End Users:</strong> Experience stronger security with zero extra steps.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Business Types Section */}
          <section className="py-16 bg-background border-b">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Perfect for Any Business with User Logins</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {businessTypes.map((type, index) => (
                  <Card key={index} className="text-center border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="mb-4 flex justify-center">{type.icon}</div>
                      <CardTitle>{type.title}</CardTitle>
                      <CardDescription className="text-base">{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{type.examples}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* User Journey Visualization */}
          <UserJourneyVisualization />

          {/* Integration Examples */}
          <IntegrationExamples />

          {/* Features Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Why Developers Choose Shoale</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Link key={index} to={feature.link} className="block">
                    <Card 
                      data-feature-card
                      className="border border-muted transition-all hover:border-[#9b87f5]/50 hover:shadow-md h-full hover:bg-accent/10"
                    >
                      <CardHeader>
                        <div className="mb-2">{feature.icon}</div>
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-foreground/80">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                      <CardFooter>
                        <span className="text-sm text-[#9b87f5] flex items-center">
                          Learn more <ChevronRight className="ml-1 h-4 w-4" />
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Context */}
          <PricingContext />

          {/* Case Studies */}
          <CaseStudies />

          {/* CTA Section */}
          <section className="py-16 bg-[#E5DEFF]/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Add Invisible Security?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of developers who trust Shoale to protect their users. 
                Start with 1,000 free authentications per month.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/demo">
                  <Button size="lg" variant="outline" className="gap-2">
                    Try Interactive Demo
                    <ChevronRight size={18} />
                  </Button>
                </Link>
                <Link to="/auth" onClick={handleGetStartedClick}>
                  <Button size="lg" className="gap-2 bg-[#9b87f5] hover:bg-[#7E69AB]">
                    Start Free Trial
                    <ChevronRight size={18} />
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • 1,000 free authentications/month • 5-minute setup
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ConversionTracker>
  );
}
