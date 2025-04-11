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
    reportsService.getArticlesReports().then((response: ReportArticleStatistics) => {
      setArticlesReports(response)
    }).catch((error) => {
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
//   const articlesData = {
//     mostViewed: {
//       _id: "67f87c6308543666d8e2ed74",
//       title: "Prueba",
//       year: "2025",
//       authors: ["dani", "cris"],
//       primaryThematicAxis: "Los niños y las niñas titulares de derechos",
//       secondaryThematicAxis: "Democratización de las relaciones familiares",
//       keywords: ["Palabras"],
//       summary: "DASD",
//       fileAddress: "research-articles/Los_ninos_y_las_ninas_titulares_de_derechos/Criterios-de-presentacion-1744338009125.pdf",
//       counter: 16,
//       downloadCounter: 7
//     },
//     mostDownload: {
//       _id: "67f87c6308543666d8e2ed74",
//       title: "Prueba",
//       year: "2025",
//       authors: ["dani", "cris"],
//       primaryThematicAxis: "Los niños y las niñas titulares de derechos",
//       secondaryThematicAxis: "Democratización de las relaciones familiares",
//       keywords: ["Palabras"],
//       summary: "DASD",
//       fileAddress: "research-articles/Los_ninos_y_las_ninas_titulares_de_derechos/Criterios-de-presentacion-1744338009125.pdf",
//       counter: 16,
//       downloadCounter: 7
//     }
//   };

//   const reportsData = {
//     mostDownloaded: {
//       _id: "67f7442537923c567247502f",
//       title: "Prueba Informe 2",
//       period: "2024-1",
//       authors: ["Juan", "Carlos"],
//       keywords: ["salus", "educacion"],
//       primaryThematicAxis: "Desarrollo Comunitario",
//       secondaryThematicAxis: "Intervención Familiar",
//       institution: "67f53808e5558a71cec3509b",
//       fileAddress: "practice-reports/Desarrollo_Comunitario/3-1744258084707.pdf",
//       counter: 0,
//       downloadCounter: 4
//     },
//     mostInteracted: {
//       _id: "67f7442b37923c5672475033",
//       title: "Prueba Informe 3",
//       period: "2024-1",
//       authors: ["Juan", "Carlos"],
//       keywords: ["salus", "educacion"],
//       primaryThematicAxis: "Desarrollo Comunitario",
//       secondaryThematicAxis: "Intervención Familiar",
//       institution: "67f53808e5558a71cec3509b",
//       fileAddress: "practice-reports/Desarrollo_Comunitario/3-1744258090516.pdf",
//       counter: 3,
//       downloadCounter: 0
//     }
//   };

//   // Mock data for charts
//   const mockArticlesData = [
//     { name: 'Prueba', views: 16, downloads: 7 },
//     { name: 'Articulo 2', views: 12, downloads: 5 },
//     { name: 'Articulo 3', views: 9, downloads: 8 },
//     { name: 'Articulo 4', views: 8, downloads: 3 },
//     { name: 'Articulo 5', views: 7, downloads: 4 },
//   ];

//   const mockReportsData = [
//     { name: 'Prueba Informe 2', views: 0, downloads: 4 },
//     { name: 'Prueba Informe 3', views: 3, downloads: 0 },
//     { name: 'Informe 3', views: 6, downloads: 3 },
//     { name: 'Informe 4', views: 2, downloads: 5 },
//     { name: 'Informe 5', views: 5, downloads: 2 },
//   ];

//   const axisData = [
//     { name: 'Los niños y las niñas titulares de derechos', value: 8 },
//     { name: 'Desarrollo Comunitario', value: 5 },
//     { name: 'Intervención Familiar', value: 7 },
//     { name: 'Democratización de las relaciones familiares', value: 4 },
//     { name: 'Otros', value: 3 },
//   ];

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

//   const totalArticles = 15;
//   const totalReports = 12;
//   const totalViews = 76;
//   const totalDownloads = 41;

// export default function Dashboard() {
//   return (
//     <div className="bg-gray-50 p-6 rounded-lg">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Analítica</h1>

//       <Tabs defaultValue="articles" className="w-full">
//         <TabsList className="mb-6">
//           <TabsTrigger value="articles" className="px-4 py-2">Artículos</TabsTrigger>
//           <TabsTrigger value="reports" className="px-4 py-2">Informes</TabsTrigger>
//           <TabsTrigger value="overview" className="px-4 py-2">Vista General</TabsTrigger>
//         </TabsList>

//         {/* Articles Tab */}
//         <TabsContent value="articles" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-500">Total Artículos</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center">
//                   <FileText className="h-5 w-5 text-blue-500 mr-2" />
//                   <p className="text-2xl font-bold">{totalArticles}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-500">Vistas Totales</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center">
//                   <Eye className="h-5 w-5 text-green-500 mr-2" />
//                   <p className="text-2xl font-bold">{mockArticlesData.reduce((sum, item) => sum + item.views, 0)}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-500">Descargas Totales</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center">
//                   <Download className="h-5 w-5 text-amber-500 mr-2" />
//                   <p className="text-2xl font-bold">{mockArticlesData.reduce((sum, item) => sum + item.downloads, 0)}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-500">Tasa de Conversión</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center">
//                   <ArrowUpRight className="h-5 w-5 text-purple-500 mr-2" />
//                   <p className="text-2xl font-bold">
//                     {Math.round(mockArticlesData.reduce((sum, item) => sum + item.downloads, 0) /
//                     mockArticlesData.reduce((sum, item) => sum + item.views, 0) * 100)}%
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Artículos Más Vistos</CardTitle>
//                 <CardDescription>Top 5 artículos por número de vistas</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={mockArticlesData} layout="vertical">
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis type="number" />
//                       <YAxis dataKey="name" type="category" width={100} />
//                       <Tooltip />
//                       <Legend />
//                       <Bar dataKey="views" name="Vistas" fill="#0088FE" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Artículos Más Descargados</CardTitle>
//                 <CardDescription>Top 5 artículos por número de descargas</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={mockArticlesData} layout="vertical">
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis type="number" />
//                       <YAxis dataKey="name" type="category" width={100} />
//                       <Tooltip />
//                       <Legend />
//                       <Bar dataKey="downloads" name="Descargas" fill="#00C49F" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Artículo Destacado</CardTitle>
//               <CardDescription>El artículo con más interacción</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="bg-white p-4 rounded-lg border border-gray-200">
//                 <h3 className="font-bold text-lg mb-2">{articlesData.mostViewed.title}</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Autores</p>
//                     <p>{articlesData.mostViewed.authors.join(', ')}</p>

//                     <p className="text-sm text-gray-500 mb-1 mt-3">Ejes Temáticos</p>
//                     <p>Principal: {articlesData.mostViewed.primaryThematicAxis}</p>
//                     <p>Secundario: {articlesData.mostViewed.secondaryThematicAxis}</p>

//                     <p className="text-sm text-gray-500 mb-1 mt-3">Palabras Clave</p>
//                     <p>{articlesData.mostViewed.keywords.join(', ')}</p>
//                   </div>

//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Año</p>
//                     <p>{articlesData.mostViewed.year}</p>

//                     <div className="flex mt-3 space-x-6">
//                       <div>
//                         <p className="text-sm text-gray-500 mb-1">Vistas</p>
//                         <p className="text-xl font-bold text-blue-500">{articlesData.mostViewed.counter}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500 mb-1">Descargas</p>
//                         <p className="text-xl font-bold text-green-500">{articlesData.mostViewed.downloadCounter}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Reports Tab */}
//         <TabsContent value="reports" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-500">Total Informes</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center">
//                   <FileText className="h-5 w-5 text-blue-500 mr-2" />
//                   <p className="text-2xl font-bold">{totalReports}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-500">Vistas Totales</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center">
//                   <Eye className="h-5 w-5 text-green-500 mr-2" />
//                   <p className="text-2xl font-bold">{mockReportsData.reduce((sum, item) => sum + item.views, 0)}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-500">Descargas Totales</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center">
//                   <Download className="h-5 w-5 text-amber-500 mr-2" />
//                   <p className="text-2xl font-bold">{mockReportsData.reduce((sum, item) => sum + item.downloads, 0)}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-500">Periodo Más Activo</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center">
//                   <ArrowUpRight className="h-5 w-5 text-purple-500 mr-2" />
//                   <p className="text-2xl font-bold">2024-1</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Informe Más Descargado</CardTitle>
//                 <CardDescription>Detalles del informe con más descargas</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <h3 className="font-bold text-lg mb-2">{reportsData.mostDownloaded.title}</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-gray-500 mb-1">Autores</p>
//                       <p>{reportsData.mostDownloaded.authors.join(', ')}</p>

//                       <p className="text-sm text-gray-500 mb-1 mt-3">Ejes Temáticos</p>
//                       <p>Principal: {reportsData.mostDownloaded.primaryThematicAxis}</p>
//                       <p>Secundario: {reportsData.mostDownloaded.secondaryThematicAxis}</p>

//                       <p className="text-sm text-gray-500 mb-1 mt-3">Palabras Clave</p>
//                       <p>{reportsData.mostDownloaded.keywords.join(', ')}</p>
//                     </div>

//                     <div>
//                       <p className="text-sm text-gray-500 mb-1">Periodo</p>
//                       <p>{reportsData.mostDownloaded.period}</p>

//                       <div className="flex mt-3 space-x-6">
//                         <div>
//                           <p className="text-sm text-gray-500 mb-1">Vistas</p>
//                           <p className="text-xl font-bold text-blue-500">{reportsData.mostDownloaded.counter}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-500 mb-1">Descargas</p>
//                           <p className="text-xl font-bold text-green-500">{reportsData.mostDownloaded.downloadCounter}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Informe Más Visto</CardTitle>
//                 <CardDescription>Detalles del informe con más vistas</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <h3 className="font-bold text-lg mb-2">{reportsData.mostInteracted.title}</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-gray-500 mb-1">Autores</p>
//                       <p>{reportsData.mostInteracted.authors.join(', ')}</p>

//                       <p className="text-sm text-gray-500 mb-1 mt-3">Ejes Temáticos</p>
//                       <p>Principal: {reportsData.mostInteracted.primaryThematicAxis}</p>
//                       <p>Secundario: {reportsData.mostInteracted.secondaryThematicAxis}</p>

//                       <p className="text-sm text-gray-500 mb-1 mt-3">Palabras Clave</p>
//                       <p>{reportsData.mostInteracted.keywords.join(', ')}</p>
//                     </div>

//                     <div>
//                       <p className="text-sm text-gray-500 mb-1">Periodo</p>
//                       <p>{reportsData.mostInteracted.period}</p>

//                       <div className="flex mt-3 space-x-6">
//                         <div>
//                           <p className="text-sm text-gray-500 mb-1">Vistas</p>
//                           <p className="text-xl font-bold text-blue-500">{reportsData.mostInteracted.counter}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-500 mb-1">Descargas</p>
//                           <p className="text-xl font-bold text-green-500">{reportsData.mostInteracted.downloadCounter}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Informes por Interacción</CardTitle>
//               <CardDescription>Comparativa de vistas y descargas</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={mockReportsData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="views" name="Vistas" fill="#0088FE" />
//                     <Bar dataKey="downloads" name="Descargas" fill="#00C49F" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Overview Tab */}
//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-500">Total Documentos</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center">
//                   <FileText className="h-5 w-5 text-blue-500 mr-2" />
//                   <p className="text-2xl font-bold">{totalArticles + totalReports}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-500">Total Vistas</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center">
//                   <Eye className="h-5 w-5 text-green-500 mr-2" />
//                   <p className="text-2xl font-bold">{totalViews}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-500">Total Descargas</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center">
//                   <Download className="h-5 w-5 text-amber-500 mr-2" />
//                   <p className="text-2xl font-bold">{totalDownloads}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium text-gray-500">Ratio Descarga/Vista</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center">
//                   <ArrowUpRight className="h-5 w-5 text-purple-500 mr-2" />
//                   <p className="text-2xl font-bold">{Math.round(totalDownloads / totalViews * 100)}%</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Distribución por Tipo</CardTitle>
//                 <CardDescription>Proporción de artículos vs informes</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={[
//                           { name: 'Artículos', value: totalArticles },
//                           { name: 'Informes', value: totalReports }
//                         ]}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       >
//                         {[0, 1].map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Ejes Temáticos Principales</CardTitle>
//                 <CardDescription>Distribución de documentos por eje temático</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={axisData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
//                       >
//                         {axisData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Actividad Mensual</CardTitle>
//               <CardDescription>Vistas y descargas por mes</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={[
//                       { name: 'Ene', vistas: 8, descargas: 4 },
//                       { name: 'Feb', vistas: 12, descargas: 6 },
//                       { name: 'Mar', vistas: 15, descargas: 8 },
//                       { name: 'Abr', vistas: 10, descargas: 5 },
//                       { name: 'May', vistas: 9, descargas: 7 },
//                       { name: 'Jun', vistas: 14, descargas: 9 },
//                       { name: 'Jul', vistas: 8, descargas: 2 }
//                     ]}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="vistas" name="Vistas" fill="#0088FE" />
//                     <Bar dataKey="descargas" name="Descargas" fill="#00C49F" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
