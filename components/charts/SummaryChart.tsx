import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Case, CaseStatus } from '../../types';

interface SummaryChartProps {
  cases: Case[];
}

const SummaryChart: React.FC<SummaryChartProps> = ({ cases }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#A0AEC0' : '#4A5568';

  const statusCounts = cases.reduce((acc, currentCase) => {
    acc[currentCase.status] = (acc[currentCase.status] || 0) + 1;
    return acc;
  }, {} as Record<CaseStatus, number>);

  const data = Object.entries(statusCounts).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
  
  const COLORS: Record<string, string> = {
    'OPEN': '#22c55e', // green-500
    'IN PROGRESS': '#f59e0b', // amber-500
    'CLOSED': '#6b7280', // gray-500
  };

  if (data.length === 0) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-96 flex flex-col justify-center items-center">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Case Status Overview</h3>
            <p className="text-gray-500 dark:text-gray-400">No case data to display.</p>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-96 flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Case Status Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            paddingAngle={5}
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name.toUpperCase()]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ 
                backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF',
                borderColor: isDarkMode ? '#4A5568' : '#E2E8F0'
            }}
            labelStyle={{ color: textColor }}
          />
          <Legend wrapperStyle={{ color: textColor }}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SummaryChart;