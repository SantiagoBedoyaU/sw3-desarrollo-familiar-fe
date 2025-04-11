import { FileText, Download, Eye } from 'lucide-react'
import { StatCard } from './components/StatCard'
import { BarChartCard } from './components/BarChartCard'
import { PieChartCard } from './components/PieChartCard'
import { useArticleStore } from '../articles/stores/ArticlesStore'
import { useEffect, useState } from 'react'
import { reportsService } from '../../shared/services/ReportsService'
import { ReportArticleStatistics, ReportArticleThematics } from '../../shared/types/entities/Reports'


export default function Dashboard() {
  const { topArticles, fetchTopArticles } = useArticleStore()
  const [articlesReports, setArticlesReports] = useState<ReportArticleStatistics>()
  const [articlesThematic, setArticlesThematic] = useState<ReportArticleThematics>()

  const [articlesThematicOrder, setArticlesThematicOrder] = useState<string[]>([])

  useEffect(() => {
    void reportsService.getArticlesReports().then((response: ReportArticleStatistics) => {
      setArticlesReports({ ...response })
    }).catch((error: unknown) => {
      console.error('Error fetching articles reports:', error)
    })
  }, [])

  useEffect(() => {
    void fetchTopArticles()
  }, [fetchTopArticles])

  useEffect(() => {
    void reportsService.getArticlesThematics().then((response: ReportArticleThematics) => {

      const dataOrder = response.map((item) => (item._id))
      const data = response.map((item, index) => (
        {
          ...item,
          name: 'Eje ' + String(index + 1),
          value: item.count,
        }))
      setArticlesThematic(data)
      setArticlesThematicOrder(dataOrder)
    }).catch((error: unknown) => {
      console.error('Error fetching articles reports:', error)
    })
  }, [])

  return (
    <section className="bg-gray-50 p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Analítica</h1>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Artículos" value={articlesReports?.totalArticles ?? 0} icon={FileText} iconColor="text-blue-500" />
        <StatCard title="Vistas Totales" value={articlesReports?.totalViews ?? 0} icon={Eye} iconColor="text-green-500" />
        <StatCard title="Descargas Totales" value={articlesReports?.totalDownloads ?? 0} icon={Download} iconColor="text-amber-500" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <BarChartCard
          title="Artículos más descargados y vistos"
          description="Top 5 artículos por número de vistas"
          data={topArticles}
          dataKey="counter"
          barColor="#0088FE"
        />

        <PieChartCard
          title="Distribución por Eje Temático"
          description="Proporción de documentos por eje temático"
          data={articlesThematic ?? []}
          dataOrder={articlesThematicOrder}
          dataKey="value"
          colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']}
        />
      </section>
    </section>
  )
}
