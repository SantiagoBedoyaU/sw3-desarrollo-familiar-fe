import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BarChartCardProps {
  title: string;
  description: string;
  data: any[];
  dataKey: string;
  barColor: string;
}

export const BarChartCard: React.FC<BarChartCardProps> = ({ title, description, data, dataKey, barColor }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="pb-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="title" type="category" width={100} />
            <Tooltip />
            <Legend />
            {
              data.map((entry, index) => (
                <Bar key={`bar-${String(index) + entry.title}`} name={entry.title} dataKey={dataKey} fill={barColor} />
              ))
            }
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
