import { FileText, Download, Eye } from 'lucide-react'
import { StatCard } from './components/StatCard'
import { BarChartCard } from './components/BarChartCard'
import { PieChartCard } from './components/PieChartCard'
import { useArticleStore } from '../articles/stores/ArticlesStore'
import { useEffect, useState } from 'react'
import { reportsService } from '../../shared/services/ReportsService'
import { ReportArticleStatistics } from '../../shared/types/entities/Reports'


export default function Dashboard() {
  const { topArticles, fetchTopArticles } = useArticleStore()
  const [articlesReports, setArticlesReports] = useState<ReportArticleStatistics>()

  useEffect(() => {
    void reportsService.getArticlesReports().then((response: ReportArticleStatistics) => {
      setArticlesReports(response)
    }).catch((error: unknown) => {
      console.error('Error fetching articles reports:', error)
    })
    console.log(articlesReports)
  }, [])

  useEffect(() => {
    fetchTopArticles()
  }, [fetchTopArticles])

  const axisData = [
    { name: 'Eje 1', value: 8 },
    { name: 'Eje 2', value: 5 },
    { name: 'Eje 3', value: 15 },
    { name: 'Eje 4', value: 2 },
    { name: 'Eje 5', value: 1 },
    { name: 'Eje 6', value: 6 },
  ]

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Analítica</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Artículos" value={15} icon={FileText} iconColor="text-blue-500" />
        <StatCard title="Vistas Totales" value={76} icon={Eye} iconColor="text-green-500" />
        <StatCard title="Descargas Totales" value={41} icon={Download} iconColor="text-amber-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <BarChartCard
          title="Artículos Más Vistos"
          description="Top 5 artículos por número de vistas"
          data={topArticles}
          dataKey="counter"
          barColor="#0088FE"
        />
        <BarChartCard
          title="Artículos Más Descargados"
          description="Top 5 artículos por número de descargadas"
          data={topArticles}
          dataKey="downloadCounter"
          barColor="#0088FE"
        />
        <PieChartCard
          title="Distribución por Eje Temático"
          description="Proporción de documentos por eje temático"
          data={axisData}
          dataKey="value"
          colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']}
        />
      </div>
    </div>
  )
}
