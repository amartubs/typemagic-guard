
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';

const BestPracticesGuide = () => {
  const bestPractices = [
    {
      category: 'Security',
      practices: [
        'Store API keys securely using environment variables',
        'Implement proper error handling for authentication failures',
        'Use HTTPS for all API communications',
        'Rotate API keys regularly',
        'Monitor authentication patterns for anomalies'
      ]
    },
    {
      category: 'Performance',
      practices: [
        'Cache biometric profiles when possible',
        'Implement request batching for bulk operations',
        'Use webhooks instead of polling for real-time updates',
        'Set appropriate timeout values for API calls',
        'Implement retry logic with exponential backoff'
      ]
    },
    {
      category: 'User Experience',
      practices: [
        'Provide clear feedback during authentication',
        'Implement graceful fallbacks for authentication failures',
        'Allow users to retrain their biometric profile',
        'Show confidence scores to help users improve',
        'Provide accessibility options for users with disabilities'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {bestPractices.map((section) => (
        <Card key={section.category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              {section.category} Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {section.practices.map((practice, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{practice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Guide</CardTitle>
          <CardDescription>
            Common issues and their solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Low Confidence Scores</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Users experiencing low confidence scores may need more training data. 
                Ensure they complete the initial training period and consider adjusting 
                sensitivity settings for their specific use case.
              </p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium">Authentication Failures</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Check API key permissions, ensure proper error handling, and verify 
                that keystroke data is being captured correctly. Review our debugging 
                guide for detailed troubleshooting steps.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Integration Issues</h4>
              <p className="text-sm text-muted-foreground mt-1">
                For integration problems, check CORS settings, verify SSL/TLS 
                configuration, and ensure your application meets minimum browser 
                requirements for keystroke capture.
              </p>
            </div>
          </div>
          
          <Button variant="outline" className="mt-4">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Troubleshooting Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BestPracticesGuide;
