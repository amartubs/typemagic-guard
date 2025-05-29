
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Key, Shield, Lock, UserCheck, FileCode, BarChart4 } from 'lucide-react';
import Header from '@/components/layout/Header';
import SEOHead from '@/components/seo/SEOHead';
import ValuePropositionTest from '@/components/optimization/ValuePropositionTest';
import ConversionTracker from '@/components/optimization/ConversionTracker';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { useConversionTracking } from '@/hooks/useConversionTracking';

const features = [
  {
    icon: <Key className="h-6 w-6 text-primary" />,
    title: 'Keystroke Biometrics',
    description: 'Analyzes your unique typing patterns to verify your identity',
    link: '/demo'
  },
  {
    icon: <UserCheck className="h-6 w-6 text-primary" />,
    title: 'Continuous Authentication',
    description: 'Constantly monitors typing behavior to ensure ongoing security',
    link: '/profile'
  },
  {
    icon: <Lock className="h-6 w-6 text-primary" />,
    title: 'Multi-layered Security',
    description: 'Combines passwords with behavioral biometrics for enhanced protection',
    link: '/login'
  },
  {
    icon: <BarChart4 className="h-6 w-6 text-primary" />,
    title: 'Analytics & Reporting',
    description: 'Detailed insights into security patterns and potential threats',
    link: '/dashboard'
  },
  {
    icon: <FileCode className="h-6 w-6 text-primary" />,
    title: 'Easy Integration',
    description: 'Seamlessly integrate with existing authentication systems',
    link: '/demo'
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: 'Fraud Prevention',
    description: 'Stops unauthorized access even with stolen credentials',
    link: '/dashboard'
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Shoale",
  "description": "Keystroke biometric authentication platform for enhanced security",
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
          title="Shoale - Advanced Keystroke Biometric Authentication | Secure Your App"
          description="Protect your application with invisible keystroke biometric authentication. Stop fraud with behavioral patterns that can't be stolen or duplicated."
          keywords={['keystroke biometrics', 'behavioral authentication', 'fraud prevention', 'continuous authentication', 'typing biometrics', 'security platform']}
          schema={structuredData}
          canonical={window.location.href}
        />
        
        <Header />

        <main className="flex-grow">
          <section className="py-20 bg-gradient-to-b from-[#E5DEFF] to-background">
            <div className="container mx-auto px-4">
              <ValuePropositionTest />
            </div>
          </section>

          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
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

          <section className="py-16 bg-[#E5DEFF]/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Experience the future of authentication with our cutting-edge keystroke biometrics platform.
              </p>
              <Link to="/login" onClick={handleGetStartedClick}>
                <Button size="lg" className="gap-2 bg-[#9b87f5] hover:bg-[#7E69AB]">
                  Sign In to Dashboard
                  <ChevronRight size={18} />
                </Button>
              </Link>
            </div>
          </section>
        </main>

        <footer className="border-t py-8 bg-[#1A1F2C] text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="font-bold text-[#9b87f5]">Shoale</span>
            </div>
            <p className="text-sm text-gray-300">© 2023 Shoale. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ConversionTracker>
  );
}
