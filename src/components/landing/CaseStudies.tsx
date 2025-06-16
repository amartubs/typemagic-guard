
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, Users, DollarSign } from 'lucide-react';

const CaseStudies = () => {
  const caseStudies = [
    {
      company: "TechCorp E-commerce",
      industry: "Retail",
      size: "50M+ users",
      challenge: "Account takeover attacks were costing $2M annually in fraud losses and customer support",
      solution: "Implemented Shoale on all login forms with zero user experience changes",
      results: [
        { metric: "Fraud Reduction", value: "87%", icon: <Shield className="h-4 w-4" /> },
        { metric: "Cost Savings", value: "$1.7M", icon: <DollarSign className="h-4 w-4" /> },
        { metric: "User Complaints", value: "-92%", icon: <Users className="h-4 w-4" /> }
      ],
      testimonial: "Shoale gave us enterprise-grade security without any user friction. Our customers don't even know it's there, but we've virtually eliminated account takeovers."
    },
    {
      company: "SecureBank Financial",
      industry: "Banking",
      size: "2M+ customers",
      challenge: "Regulatory requirements for stronger authentication while maintaining user experience",
      solution: "Deployed Shoale as continuous authentication layer for all digital banking sessions",
      results: [
        { metric: "Security Score", value: "+95%", icon: <Shield className="h-4 w-4" /> },
        { metric: "Login Time", value: "No change", icon: <TrendingUp className="h-4 w-4" /> },
        { metric: "Compliance", value: "100%", icon: <Shield className="h-4 w-4" /> }
      ],
      testimonial: "We needed to meet new regulatory requirements without impacting our customers. Shoale delivered both security and compliance with zero user impact."
    },
    {
      company: "EduTech University",
      industry: "Education",
      size: "100K+ students",
      challenge: "Online exam integrity and preventing identity fraud in remote learning",
      solution: "Integrated Shoale into exam platform for continuous identity verification",
      results: [
        { metric: "Exam Fraud", value: "-78%", icon: <Shield className="h-4 w-4" /> },
        { metric: "Student Satisfaction", value: "+23%", icon: <Users className="h-4 w-4" /> },
        { metric: "Admin Workload", value: "-45%", icon: <TrendingUp className="h-4 w-4" /> }
      ],
      testimonial: "Shoale helped us maintain academic integrity while keeping the exam experience smooth for legitimate students."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            See how organizations across industries have strengthened security 
            while improving user experience with Shoale.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{study.industry}</Badge>
                  <Badge variant="secondary">{study.size}</Badge>
                </div>
                <CardTitle className="text-xl">{study.company}</CardTitle>
                <CardDescription className="text-base">{study.challenge}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Solution</h4>
                  <p className="text-sm text-muted-foreground">{study.solution}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Results</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {study.results.map((result, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-background rounded border">
                        <div className="flex items-center gap-2">
                          {result.icon}
                          <span className="text-sm font-medium">{result.metric}</span>
                        </div>
                        <span className="font-bold text-primary">{result.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm italic text-muted-foreground">
                    "{study.testimonial}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Join These Success Stories?</h3>
              <p className="text-muted-foreground mb-6">
                Thousands of organizations trust Shoale to protect their users while maintaining 
                seamless experiences. From startups to Fortune 500 companies, see why Shoale 
                is the invisible security layer of choice.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99.8%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0ms</div>
                  <div className="text-sm text-muted-foreground">Added Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100M+</div>
                  <div className="text-sm text-muted-foreground">Protected Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5min</div>
                  <div className="text-sm text-muted-foreground">Setup Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
