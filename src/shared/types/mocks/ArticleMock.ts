import Article from '../../../features/articles/entities/Article'

const ArticleMock: Article[] = [
  {
    _id: '1',
    title: 'Artículo de aceite enriquecido en niñas',
    authors: ['Naydú Núñez'],
    primaryThematicAxis:
      'La relación familia - escuela un asunto de corresponsabilidad',
    secondaryThematicAxis: 'Democratización de las relaciones familiares',
    keywords: 'aceite, enriquecido, niñas'.split(','),
    summary: 'Resumen del artículo',
    file: new File([], 'file.pdf'),
    year: '2023',
  },
  {
    _id: '2',
    title: 'Artículo de aceite enriquecido en niñas',
    authors: 'Naydú Núñez, Juan Perez'.split(','),
    primaryThematicAxis: 'Democratización de las relaciones familiares',
    secondaryThematicAxis:
      'La relación familia - escuela un asunto de corresponsabilidad',
    keywords: 'aceite, enriquecido, niñas'.split(','),
    summary: 'Resumen del artículo',
    file: new File([], 'file.pdf'),
    year: '2023',
  },
  {
    _id: '3',
    title: 'Artículo de aceite enriquecido en niñas',
    authors: ['Naydú Núñez'],
    primaryThematicAxis:
      'La relación familia - escuela un asunto de corresponsabilidad',
    secondaryThematicAxis: 'Democratización de las relaciones familiares',
    keywords: 'aceite, enriquecido, niñas'.split(','),
    summary: 'Resumen del artículo',
    file: new File([], 'file.pdf'),
    year: '2023',
  },
  {
    _id: '4',
    title: 'Artículo de aceite enriquecido en niñas',
    authors: ['Naydú Núñez'],
    primaryThematicAxis: 'Democratización de las relaciones familiares',
    secondaryThematicAxis:
      'La relación familia - escuela un asunto de corresponsabilidad',
    keywords: 'aceite, enriquecido, niñas'.split(','),
    summary: 'Resumen del artículo',
    file: new File([], 'file.pdf'),
    year: '2023',
  },
]

export default ArticleMock
