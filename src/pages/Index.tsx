
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Fingerprint, Lock, Key, Sparkles, Code, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SecurityLevelSlider } from '@/components/ui-custom/SecurityLevel';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import KeystrokeCapture from '@/components/ui-custom/KeystrokeCapture';

const Index = () => {
  // Refs for animation elements
  const heroRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-scale-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe hero section
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    // Observe feature sections
    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 opacity-0" ref={heroRef}>
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Next-Generation Authentication
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                  Type Like Only <span className="text-primary">You</span> Can
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  KeyGuard enhances security with behavioral biometric authentication 
                  that recognizes your unique typing patterns.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" asChild>
                    <Link to="/demo">
                      Try Demo <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/dashboard">
                      View Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="glass-panel p-6 md:p-8 lg:p-10 transform">
                <h3 className="text-lg font-semibold mb-4">Experience Biometric Authentication</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Type a sample message below to see your unique keystroke pattern in action:
                </p>
                
                <KeystrokeCapture 
                  className="mb-6"
                  inputProps={{ 
                    placeholder: "Type something to see keystroke analysis...",
                  }}
                />
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Confidence Score</p>
                    <SecurityLevelSlider value={75} />
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Your typing pattern is as unique as your fingerprint. KeyGuard analyzes rhythm, 
                    pressure, and timing to create your biometric profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Security Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                KeyGuard combines multiple security layers for comprehensive protection
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Fingerprint className="w-10 h-10 text-primary" />,
                  title: "Behavioral Biometrics",
                  description: "Identify users by their unique typing patterns, creating a digital fingerprint that can't be easily replicated."
                },
                {
                  icon: <Lock className="w-10 h-10 text-primary" />,
                  title: "Continuous Authentication",
                  description: "Constantly verify user identity throughout sessions, not just at login, for persistent security."
                },
                {
                  icon: <Key className="w-10 h-10 text-primary" />,
                  title: "Machine Learning Analysis",
                  description: "Advanced algorithms analyze keystroke dynamics to detect and prevent unauthorized access attempts."
                },
                {
                  icon: <Shield className="w-10 h-10 text-primary" />,
                  title: "Fraud Prevention",
                  description: "Detect suspicious behavior patterns in real-time to prevent account takeovers and fraud."
                },
                {
                  icon: <Code className="w-10 h-10 text-primary" />,
                  title: "Easy Integration",
                  description: "Simple API integration with existing authentication systems and login forms."
                },
                {
                  icon: <Users className="w-10 h-10 text-primary" />,
                  title: "No User Friction",
                  description: "Enhances security without adding extra steps or friction to the user experience."
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  ref={el => featureRefs.current[index] = el}
                  className="glass-panel p-6 opacity-0 transition-all duration-300"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How KeyGuard Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Seamless security through sophisticated pattern recognition
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
              {[
                {
                  step: "01",
                  title: "Profile Creation",
                  description: "As users type naturally, KeyGuard builds a unique biometric profile based on typing patterns."
                },
                {
                  step: "02",
                  title: "Continuous Analysis",
                  description: "Our system continuously analyzes typing behavior against the established profile."
                },
                {
                  step: "03",
                  title: "Adaptive Learning",
                  description: "The system adapts to subtle changes in typing patterns over time while maintaining security."
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute top-0 left-0 text-8xl font-bold text-primary/10">
                    {item.step}
                  </div>
                  <div className="pt-10 pl-4 relative">
                    <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex flex-col items-center text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Experience the Future of Authentication?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Join thousands of businesses enhancing their security without compromising user experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link to="/demo">
                    Try the Demo <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
