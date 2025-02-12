'use client';

import React, {useMemo} from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface MetricDatum {
    name: string;
    value: number;
    unit: string;
  }

interface BarChartComponentProps {
    metricKey: string;
    metricData: MetricDatum[];
  }

const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random hex color
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black bg-opacity-80 text-white p-2 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-gray-300">
            Value: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };



const BarChartComponent: React.FC<BarChartComponentProps> = ({metricKey, metricData })=> {
console.log("BarChartComponent - metricKey:", metricKey, "metricData:", metricData);

const randomColor = useMemo(() => getRandomColor(), []);
  return (
    <div className="overflow-x-auto">
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={metricData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis label={{ value: metricData[1].unit, angle: -90, position: 'insideLeft' }}/>
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
        
        <Bar dataKey="value" fill={randomColor} radius={[10, 10, 0, 0]} >
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;