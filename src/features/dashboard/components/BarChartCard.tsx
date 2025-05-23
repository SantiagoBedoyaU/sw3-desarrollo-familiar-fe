import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BarChartCardProps {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKey: string;
  barColor: string;
  nameKey?: string;
}

export const BarChartCard: React.FC<BarChartCardProps> = ({ title, description, data, dataKey, barColor, nameKey }) => {
  return (
    <section className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <section className="pb-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </section>
      <section className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="title" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={barColor} name={nameKey} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </section>
  )
}
