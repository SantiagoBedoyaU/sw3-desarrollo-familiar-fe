import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconColor }) => {
  return (
    <section className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <section className="pb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      </section>
      <section className="flex items-center">
        <Icon className={`h-5 w-5 ${iconColor} mr-2`} />
        <p className="text-2xl font-bold">{value}</p>
      </section>
    </section>
  )
}
