
import React, { useEffect, useRef } from 'react';
import { VisualizationData } from '@/lib/types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BiometricVisualizerProps {
  data: VisualizationData;
  type: 'confidence' | 'typing-speed' | 'heatmap';
  title?: string;
  className?: string;
}

const BiometricVisualizer: React.FC<BiometricVisualizerProps> = ({
  data,
  type,
  title,
  className = '',
}) => {
  // Format data for charts
  const confidenceData = data.confidenceHistory.map((item, index) => ({
    name: `Sample ${index + 1}`,
    value: item.score,
  }));
  
  const typingSpeedData = data.typingSpeed.map((speed, index) => ({
    name: `Sample ${index + 1}`,
    value: speed,
  }));
  
  const heatmapData = Object.entries(data.keyPressHeatmap)
    .map(([key, value]) => ({
      name: key,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15); // Only show top 15 keys
  
  const renderChart = () => {
    switch (type) {
      case 'confidence':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#888" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                animationDuration={1000}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'typing-speed':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={typingSpeedData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#888" />
              <YAxis tick={{ fontSize: 12 }} stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                animationDuration={1000}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--accent))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'heatmap':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={heatmapData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={true} vertical={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#888" />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12 }} 
                width={40}
                stroke="#888"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
                formatter={(value: number) => [`Frequency: ${value}`, 'Key Usage']}
              />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--primary))" 
                radius={[0, 4, 4, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>No visualization selected</div>;
    }
  };
  
  return (
    <div className={`bg-card rounded-lg p-4 shadow-sm ${className}`}>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      {renderChart()}
    </div>
  );
};

export default BiometricVisualizer;
