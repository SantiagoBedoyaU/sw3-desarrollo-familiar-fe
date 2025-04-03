import { useState } from 'react'
import { Search, Edit2, Trash2, Download, Plus } from 'lucide-react'
import { Dialog } from '../components/common/dialog/Dialog'
import { DialogTrigger } from '../components/common/dialog/DialogTrigger'
import { DialogContent } from '../components/common/dialog/DialogContent'
import { DialogHeader } from '../components/common/dialog/DialogHeader.'
import { DialogTitle } from '../components/common/dialog/DialogTitle'
import { DialogDescription } from '../components/common/dialog/DialogDescription'
import ArticleForm from './components/ArticleForm'

const Articles = () => {
    // Estado para los filtros de búsqueda
    const [searchFilters, setSearchFilters] = useState({
        title: '',
        author: '',
        thematicAxis: '',
        thematicAxis2: '',
    })

    // Estado para los artículos
    const [articles, setArticles] = useState([
        {
            id: '1',
            title: 'Artículo de aceite enriquecido en niñas',
            author: 'Naydú Núñez',
            thematicAxis: 'Pediatría',
            thematicAxis2: 'Pediatría',
        },
        {
            id: '2',
            title: 'Artículo de aceite enriquecido en niñas',
            author: 'Naydú Núñez',
            thematicAxis: 'Nutrición',
            thematicAxis2: 'Pediatría',
        },
        {
            id: '3',
            title: 'Artículo de aceite enriquecido en niñas',
            author: 'Naydú Núñez',
            thematicAxis: 'Pediatría',
            thematicAxis2: 'Pediatría',
        },
        {
            id: '4',
            title: 'Artículo de aceite enriquecido en niñas',
            author: 'Naydú Núñez',
            thematicAxis: 'Nutrición',
            thematicAxis2: 'Pediatría',
        },
    ])

    // Manejadores de eventos
    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setSearchFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSearch = () => {
        // Aquí iría la lógica de búsqueda real
        console.log('Buscando con filtros:', searchFilters)
    }

    const handleEdit = (id: string) => {
        console.log('Editando artículo:', id)
    }

    const handleDelete = (id: string) => {
        console.log('Eliminando artículo:', id)
        setArticles(articles.filter((article) => article.id !== id))
    }

    const handleDownload = (id: string) => {
        console.log('Descargando artículo:', id)
    }

    // Lista de ejes temáticos
    const thematicOptions = [
        { value: '', label: 'Seleccione' },
        { value: 'Pediatría', label: 'Pediatría' },
        { value: 'Nutrición', label: 'Nutrición' },
        { value: 'Salud Pública', label: 'Salud Pública' },
    ]

    return (
        <div className='max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
            <section className='md:relative md:flex md:items-center md:justify-between mb-4'>
                <ArticleForm mode='add' />
                <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>
                    Filtrar artículos de investigación
                </h2>
            </section>
            {/* Filtros de búsqueda */}
            <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
                <div className='col-span-full flex flex-col sm:flex-row items-center justify-between gap-2'>
                    <input
                        type='text'
                        name='title'
                        placeholder='Título del artículo'
                        value={searchFilters.title}
                        onChange={handleFilterChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                        type='text'
                        name='author'
                        placeholder='Autor(es) (ej: Naydú Núñez, Juan Pérez)'
                        value={searchFilters.author}
                        onChange={handleFilterChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                <div className='relative'>
                    <select
                        name='thematicAxis'
                        value={searchFilters.thematicAxis}
                        onChange={handleFilterChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none'>
                        <option value=''>Eje temático principal</option>
                        {thematicOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className='absolute top-3 right-0 flex items-center px-2 pointer-events-none'>
                        <svg
                            className='w-4 h-4 text-gray-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M19 9l-7 7-7-7'></path>
                        </svg>
                    </div>
                </div>
                <div className='relative'>
                    <select
                        name='thematicAxis2'
                        value={searchFilters.thematicAxis2}
                        onChange={handleFilterChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none'>
                        <option value=''>Eje temático secundario</option>
                        {thematicOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className='absolute top-3 right-0 flex items-center px-2 pointer-events-none'>
                        <svg
                            className='w-4 h-4 text-gray-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M19 9l-7 7-7-7'></path>
                        </svg>
                    </div>
                </div>
                {/* Botón de búsqueda */}
                <div className='mb-6 md:mb-2 sm:col-span-full md:col-span-1'>
                    <button
                        onClick={handleSearch}
                        className='flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300'>
                        <Search size={16} className='inline-block mr-2' />
                        <span>Buscar</span>
                    </button>
                </div>
            </section>

            {/* Lista de artículos */}
            <div className='space-y-4'>
                {articles.map((article) => (
                    <div
                        key={article.id}
                        className='border border-blue-200 rounded-lg p-4 bg-blue-50'>
                        <h3 className='font-bold text-blue-800'>{article.title}</h3>
                        <div className='text-sm text-gray-600 md:mb-2 lg:mb-0'>
                            <span>Autor: {article.author}</span>
                            <span className='mx-2'>•</span>
                            <span>Eje temático: {article.thematicAxis}</span>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-end mt-2 space-x-2 space-y-0.5'>
                            <button
                                onClick={() => handleEdit(article.id)}
                                className='flex w-full md:w-fit items-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition duration-300'>
                                <Edit2 size={16} className='mr-1' />
                                <span>Editar</span>
                            </button>
                            <button
                                onClick={() => handleDelete(article.id)}
                                className='flex w-full md:w-fit items-center bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition duration-300'>
                                <Trash2 size={16} className='mr-1' />
                                <span>Eliminar</span>
                            </button>
                            <button
                                onClick={() => handleDownload(article.id)}
                                className='flex w-full md:w-fit items-center border-gray-200 border-2 bg-white hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm transition duration-300'>
                                <Download size={16} className='mr-1' />
                                <span>Descargar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Articles
