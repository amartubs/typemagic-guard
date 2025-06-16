
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TimingData {
  keystroke: number;
  current: number;
  selected: number;
}

interface TimingChartProps {
  timingChart: TimingData[];
}

const TimingChart: React.FC<TimingChartProps> = ({ timingChart }) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium">Keystroke Timing Patterns</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timingChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="keystroke" 
              label={{ value: 'Keystroke #', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Duration (ms)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                `${value.toFixed(0)}ms`,
                name === 'current' ? 'Current Sample' : 'Previous Sample'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="current" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="current"
            />
            <Line 
              type="monotone" 
              dataKey="selected" 
              stroke="#82ca9d" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="selected"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimingChart;
