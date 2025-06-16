
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Building, Code, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingContext = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Who Pays for Shoale?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Shoale is a B2B service. End users never pay anything - it's completely free for them. 
            Only businesses and developers who integrate our API pay for the service.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-900">For End Users</CardTitle>
              <Badge className="bg-green-100 text-green-800 border-green-300">Always Free</Badge>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No downloads or installations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No additional steps during login</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Enhanced security automatically</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Works on any device or browser</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-white border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  <strong>You encounter Shoale when:</strong> Visiting websites that have integrated 
                  our security technology. It works invisibly to protect your accounts.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="text-center">
              <Code className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-blue-900">For Developers</CardTitle>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">API Usage Based</Badge>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Free tier: 1,000 authentications/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Pay per additional authentication</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Simple SDK integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Full API documentation</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/auth">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader className="text-center">
              <Building className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-purple-900">For Businesses</CardTitle>
              <Badge className="bg-purple-100 text-purple-800 border-purple-300">Enterprise Plans</Badge>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Volume discounts available</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>White-label solutions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Dedicated support team</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Custom integration assistance</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/pricing">
                  <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
                    View Enterprise Plans
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-4">Common Use Cases</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-blue-900">Individual Developers</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Adding security to personal projects</li>
                  <li>• Building SaaS applications</li>
                  <li>• Client website protection</li>
                  <li>• Startup MVP security layer</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-purple-900">Enterprise Teams</h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li>• Large-scale user base protection</li>
                  <li>• Multi-application integration</li>
                  <li>• Compliance requirements</li>
                  <li>• Advanced fraud prevention</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PricingContext;
