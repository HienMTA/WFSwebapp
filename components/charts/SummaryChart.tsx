
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', Cases: 12, Artefacts: 24 },
  { name: 'Feb', Cases: 19, Artefacts: 13 },
  { name: 'Mar', Cases: 3, Artefacts: 98 },
  { name: 'Apr', Cases: 5, Artefacts: 39 },
  { name: 'May', Cases: 2, Artefacts: 48 },
  { name: 'Jun', Cases: 3, Artefacts: 38 },
  { name: 'Jul', Cases: 15, Artefacts: 43 },
];

const SummaryChart: React.FC = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#A0AEC0' : '#4A5568';
  const gridColor = isDarkMode ? '#2D3748' : '#E2E8F0';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-96">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Monthly Activity</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" tick={{ fill: textColor }} />
          <YAxis tick={{ fill: textColor }} />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF',
                borderColor: isDarkMode ? '#4A5568' : '#E2E8F0'
            }}
            labelStyle={{ color: textColor }}
          />
          <Legend wrapperStyle={{ color: textColor }}/>
          <Bar dataKey="Cases" fill="#3b82f6" />
          <Bar dataKey="Artefacts" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SummaryChart;
