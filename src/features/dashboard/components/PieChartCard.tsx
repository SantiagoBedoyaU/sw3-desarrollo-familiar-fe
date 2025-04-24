import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PieChartCardProps {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];

  dataOrder: string[]
  dataKey: string;
  colors: string[];
}

export const PieChartCard: React.FC<PieChartCardProps> = ({ title, description, data, dataOrder, dataKey, colors }) => {
  return (
    <section className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <section className="pb-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </section>
      <section className='flex flex-wrap mb-4 gap-1.5'>
        {
          dataOrder.map((item, index) => {
            return (
              <section key={item} className="flex items-center mb-2">
                <section className="w-4 h-4 mr-2" style={{ backgroundColor: colors[index % colors.length] }}></section>
                <span>{item}</span>
              </section>
            )
          }
          )
        }
      </section>
      <section className="h-64">
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
      </section>
    </section>
  )
}
