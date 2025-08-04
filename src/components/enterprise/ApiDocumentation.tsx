
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book } from 'lucide-react';
import ApiOverview from './api-docs/ApiOverview';
import QuickStartGuides from './api-docs/QuickStartGuides';
import ApiEndpoints from './api-docs/ApiEndpoints';
import SdkLibraries from './api-docs/SdkLibraries';
import BestPracticesGuide from './api-docs/BestPracticesGuide';
import { IndustryApis } from './api-docs/IndustryApis';
import { ApiSecurity } from './api-docs/ApiSecurity';

const ApiDocumentation = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">API Documentation & Integration Guides</h2>
        <p className="text-muted-foreground mt-2">
          Complete documentation, SDKs, and integration guides for TypeMagic Guard
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
          <TabsTrigger value="endpoints">API Reference</TabsTrigger>
          <TabsTrigger value="industry">Industry APIs</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="sdks">SDKs</TabsTrigger>
          <TabsTrigger value="guides">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ApiOverview />
        </TabsContent>

        <TabsContent value="quickstart" className="space-y-6">
          <QuickStartGuides />
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <ApiEndpoints />
        </TabsContent>

        <TabsContent value="industry" className="space-y-6">
          <IndustryApis />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <ApiSecurity />
        </TabsContent>

        <TabsContent value="sdks" className="space-y-6">
          <SdkLibraries />
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <BestPracticesGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiDocumentation;
