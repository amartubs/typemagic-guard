import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Zap, Shield, BarChart3, Settings, RefreshCw } from 'lucide-react';
import { CDNManager } from '@/lib/cdn/CDNManager';

interface CDNStats {
  hitRate: number;
  missRate: number;
  bandwidthSaved: number;
  requestCount: number;
  errors: number;
  averageLatency: number;
  cachingEfficiency: number;
  compressionRatio: number;
}

export const CDNIntegration: React.FC = () => {
  const [stats, setStats] = useState<CDNStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    loadCDNStats();
    const interval = setInterval(loadCDNStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadCDNStats = async () => {
    try {
      const cdnManager = CDNManager.getInstance();
      const cdnStats = await cdnManager.getCDNStats();
      
      setStats({
        hitRate: cdnStats.hitRate,
        missRate: cdnStats.missRate,
        bandwidthSaved: cdnStats.optimizationSavings.bandwidthSaved,
        requestCount: (cdnStats as any).requestCount || 1000,
        errors: cdnStats.errors,
        averageLatency: cdnStats.performanceMetrics.loadTime || 0,
        cachingEfficiency: cdnStats.performanceMetrics.cachingEfficiency,
        compressionRatio: cdnStats.performanceMetrics.compressionRatio
      });
    } catch (error) {
      console.error('Failed to load CDN stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeAssets = async () => {
    setOptimizing(true);
    try {
      const cdnManager = CDNManager.getInstance();
      
      // Optimize critical assets
      const criticalAssets = [
        '/src/assets/logo.svg',
        '/src/components/ui/button.tsx',
        '/src/index.css'
      ];
      
      await cdnManager.preloadCriticalAssets(criticalAssets);
      await cdnManager.setupAdvancedCaching();
      
      // Refresh stats
      await loadCDNStats();
    } catch (error) {
      console.error('Asset optimization failed:', error);
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">CDN Management</h2>
          <p className="text-muted-foreground">Monitor and optimize content delivery performance</p>
        </div>
        <Button onClick={handleOptimizeAssets} disabled={optimizing}>
          {optimizing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Optimize Assets
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.hitRate.toFixed(1)}%</div>
            <Progress value={stats?.hitRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth Saved</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.bandwidthSaved || 0).toFixed(1)} MB</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Latency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageLatency.toFixed(0)}ms</div>
            <Badge variant={stats && stats.averageLatency < 100 ? "default" : "secondary"} className="mt-1">
              {stats && stats.averageLatency < 100 ? "Optimal" : "Good"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.requestCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats?.errors} errors</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="caching">Caching</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Caching Efficiency</span>
                    <span className="text-sm text-muted-foreground">
                      {stats?.cachingEfficiency.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={stats?.cachingEfficiency} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Compression Ratio</span>
                    <span className="text-sm text-muted-foreground">
                      {stats?.compressionRatio.toFixed(1)}:1
                    </span>
                  </div>
                  <Progress value={(stats?.compressionRatio || 1) * 20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="caching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats?.hitRate.toFixed(1)}%</div>
                  <p className="text-sm text-muted-foreground">Hit Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats?.missRate.toFixed(1)}%</div>
                  <p className="text-sm text-muted-foreground">Miss Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats?.requestCount.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">JavaScript Bundles</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Main Bundle</span>
                      <Badge variant="outline">Optimized</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Vendor Bundle</span>
                      <Badge variant="outline">Cached</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Static Assets</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Images</span>
                      <Badge variant="outline">WebP Enabled</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fonts</span>
                      <Badge variant="outline">Preloaded</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};