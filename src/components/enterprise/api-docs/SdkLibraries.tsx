
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';

const SdkLibraries = () => {
  const sdkLanguages = [
    {
      name: 'JavaScript/TypeScript',
      version: '2.1.0',
      install: 'npm install @typemagic/guard-sdk',
      docs: 'https://docs.typemagic.com/sdk/javascript'
    },
    {
      name: 'Python',
      version: '1.8.0', 
      install: 'pip install typemagic-guard',
      docs: 'https://docs.typemagic.com/sdk/python'
    },
    {
      name: 'PHP',
      version: '1.5.0',
      install: 'composer require typemagic/guard-sdk',
      docs: 'https://docs.typemagic.com/sdk/php'
    },
    {
      name: 'Java',
      version: '1.6.0',
      install: 'implementation "com.typemagic:guard-sdk:1.6.0"',
      docs: 'https://docs.typemagic.com/sdk/java'
    },
    {
      name: 'C#/.NET',
      version: '1.4.0',
      install: 'Install-Package TypeMagic.Guard.SDK',
      docs: 'https://docs.typemagic.com/sdk/dotnet'
    },
    {
      name: 'Ruby',
      version: '1.3.0',
      install: 'gem install typemagic-guard',
      docs: 'https://docs.typemagic.com/sdk/ruby'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Official SDKs
        </CardTitle>
        <CardDescription>
          Native libraries for popular programming languages and frameworks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sdkLanguages.map((sdk) => (
            <Card key={sdk.name} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{sdk.name}</h3>
                <Badge variant="secondary">v{sdk.version}</Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Installation:</label>
                  <div className="bg-muted p-2 rounded text-sm font-mono mt-1">
                    {sdk.install}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h4 className="font-medium mb-2">Community SDKs</h4>
          <p className="text-sm text-muted-foreground">
            Can't find an SDK for your language? Check out our community-maintained libraries or 
            contribute your own. We also provide OpenAPI specifications for generating custom clients.
          </p>
          <Button variant="link" className="p-0 h-auto mt-2">
            <ExternalLink className="h-4 w-4 mr-1" />
            View Community SDKs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SdkLibraries;
