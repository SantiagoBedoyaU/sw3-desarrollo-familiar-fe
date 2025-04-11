import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PieChartCardProps {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKey: string;
  colors: string[];
}

export const PieChartCard: React.FC<PieChartCardProps> = ({ title, description, data, dataKey, colors }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="pb-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* eslint-disable @typescript-eslint/restrict-template-expressions */}
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {
                /* eslint-disable */
                data.map((entry, index) => (
                  <Cell key={`cell-${String(index) + entry}`} fill={colors[index % colors.length]} />
                ))
                /* eslint-enable */
              }
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
