import React from 'react'

interface DetailCardProps {
  title: string;
  details: Record<string, string | number>;
}

export const DetailCard: React.FC<DetailCardProps> = ({ title, details }) => {
  return (
    <section className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(details).map(([key, value]) => (
          <section key={key}>
            <p className="text-sm text-gray-500 mb-1">{key}</p>
            <p>{value}</p>
          </section>
        ))}
      </section>
    </section>
  )
}
