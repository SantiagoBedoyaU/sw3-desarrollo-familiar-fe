import Swal from 'sweetalert2'
import { articleService } from '../../../shared/services/ArticlesService'
import Article from '../../../shared/types/entities/Article'

const downloadArticle = async (article: Article) => {
  await articleService.downloadArticle(article).catch((error: unknown) => {
    void Swal.fire({
      title: 'Error',
      text: 'Ocurrió un error al descargar el artículo.',
      icon: 'error',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#4B5563',
    })
    console.error(error)
    return null
  })
}

export default downloadArticle
