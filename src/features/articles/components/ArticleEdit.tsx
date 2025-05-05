import { useEffect, useState } from "react"
import Article, { ArticleUpdate } from "../entities/Article"
import { useArticleStore } from "../stores/ArticlesStore"
import Swal from "sweetalert2"
import Input from "../../../shared/components/common/Input"
import Label from "../../../shared/components/common/Label"
import { Plus } from "lucide-react"
import Select from "../../../shared/components/common/Select"
import TextArea from "../../../shared/components/common/TextArea"
import { thematicOptions } from "../../../shared/constants/cts"
import { practiceService } from "../../practiceReports/services/PraticeReportService"
import PracticeReport from "../../practiceReports/entities/PracticeReport"

const primaryThematicOptions = thematicOptions.map((option: string) => ({
  label: option,
  value: option,
  key: option + 'primary_area',
}))
const secondaryThematicOptions = thematicOptions.map((option: string) => ({
  label: option,
  value: option,
  key: option + 'secondary_area',
}))
interface ArticleEditProps {
  article: Article
  onClose: (value: boolean) => void
  setUpdatedArticles: (articles: Article[]) => void
}
function ArticleEdit({ article, onClose, setUpdatedArticles }: Readonly<ArticleEditProps>) {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { editArticle } = useArticleStore()


  const [title, setTitle] = useState(article.title ?? '')
  const [year, setYear] = useState(article.year ?? new Date().getFullYear().toString())
  const [authors, setAuthors] = useState<string[]>([])
  const [summary, setSummary] = useState(article.summary ?? '')
  const [keywords, setKeywords] = useState<string[]>([])
  const [file, setFile] = useState<File | null>(article.file ?? null) // Estado para el archivo
  const [fileName, setFileName] = useState(article.fileAddress ?? '') // Estado para el nombre del archivo
  const [fileError, setFileError] = useState(false) // Estado para errores del archivo
  const [changeableKeywords, setChangeableKeywords] = useState(
    article?.keywords ?? [],
  )
  const [changeableAuthors, setChangeableAuthors] = useState(
    article?.authors ?? [],
  )
  const [primaryThematicAxis, setPrimaryThematicAxis] = useState(article.primaryThematicAxis ?? '')
  const [secondaryThematicAxis, setSecondaryThematicAxis] = useState(article.secondaryThematicAxis ?? '')
  const [practiceReportId, setPracticeReportId] = useState('')
  const [formErrors, setFormErrors] = useState({
    title: false,
    year: false,
    authors: false,
    primaryThematicAxis: false,
    summary: false,
    keywords: false,
    // changeableAuthors: false,
  })

  const [practiceReports, setPracticeReports] = useState<PracticeReport[]>([])
  useEffect(() => {
    void practiceService.getAll().then((res) => {
      setPracticeReports(res.data)
    })
  }, [])

  useEffect(() => {
    console.log('====================================');
    console.log(article);
    console.log('====================================');
  }, [])

  // Función para extraer el nombre del archivo de una ruta
  const extractFileNameFromPath = (path: string): string => {
    if (!path) return '';
    return path.split('/').pop() || '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // Extraer el nombre del archivo actual de fileAddress
      const currentFileName = extractFileNameFromPath(article.fileAddress || '');

      // Si el nombre del nuevo archivo es igual al actual, mostrar una advertencia
      if (file.name === currentFileName) {
        void Swal.fire({
          title: 'Atención',
          text: 'El nombre del archivo es el mismo que el actual. Considera renombrarlo para evitar problemas.',
          icon: 'warning',
          confirmButtonText: 'Entendido',
        });
      }

      setFile(file);
      setFileName(file.name);
      setFileError(false);
    } else {
      setFile(null);
      setFileName('');
      if (!fileName) {
        setFileError(true);
      }
    }
  }


  const resetForm = () => {
    setTitle('')
    setAuthors([])
    setPrimaryThematicAxis('')
    setSecondaryThematicAxis('')
    setYear(new Date().getFullYear().toString())
    setSummary('')
    setKeywords([])
    setChangeableAuthors([])
    setChangeableKeywords([])
    setPracticeReportId('')
    setFileError(false)
    setFile(null)
    setFormErrors({
      title: false,
      year: false,
      authors: false,
      primaryThematicAxis: false,
      summary: false,
      keywords: false,
    })
  }

  const validateForm = (): boolean => {
    const errors = {
      title: !title.trim(),
      year: !year.trim(),
      authors: !changeableAuthors.length,
      primaryThematicAxis: !primaryThematicAxis,
      summary: !summary.trim(),
      keywords: !changeableKeywords.length,
    }

    setFormErrors(errors)
    return !Object.values(errors).some(Boolean)
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (!validateForm()) {
      return
    }

    if (!file && !fileName) {
      setFileError(true)
      return
    }

    if (article?._id) {

      const articleData: ArticleUpdate = {
        _id: article._id,
        title: title.trim(),
        authors: changeableAuthors.join(','),
        year: year.trim(),
        primaryThematicAxis: primaryThematicAxis,
        summary: summary.trim(),
        keywords: changeableKeywords.join(','),
      }

      if (secondaryThematicAxis) {
        articleData.secondaryThematicAxis = secondaryThematicAxis
      }
      if (practiceReportId) {
        articleData.practiceReport = practiceReportId
      }
      void editArticle(article._id, articleData).then(() => {
        onClose(false)
        void Swal.fire({
          title: 'Artículo editado',
          text: 'El artículo ha sido editado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        })
        window.location.reload()
      })
    }
    setIsSubmitting(false)
    resetForm()
  }

  let buttonText = ''
  if (isSubmitting) {
    buttonText = 'Cargando...'
  } else {
    buttonText = 'Guardar cambios'
  }
  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-5 mt-4 px-1 md:px-4 h-[83vh]"
    >
      <section className="md:flex md:items-center md:justify-between md:space-x-4">
        <Label htmlFor="title" error={formErrors.title} text="Título*" />
        <Input
          error={formErrors.title}
          errorString="El título es requerido"
          placeholder="Ingrese el título del artículo"
          id="title"
          name="title"
          minLength={3}
          value={title}
          maxLength={255}
          type="text"
          required={false}
          onChange={(e) => setTitle(e.target.value)}
        />
      </section>

      <section className="md:flex md:items-center md:justify-between md:space-x-4">
        <Label htmlFor="year" error={formErrors.year} text="Año*" />
        <Input
          error={formErrors.year}
          errorString="El año es requerido"
          placeholder="Ingrese (YYYY) el año de publicación"
          id="year"
          name="year"
          value={year}
          type="number"
          pattern="\d{4}"
          min={1950}
          max={new Date().getFullYear()}
          required={false}
          onChange={(e) => setYear(e.target.value)}
        />
      </section>

      <section className="md:flex md:items-center md:justify-between md:space-x-4">
        <Label
          htmlFor="authors"
          error={formErrors.authors && changeableAuthors.length === 0}
          text="Autor(es)*"
        />
        <Input
          error={formErrors.authors && changeableAuthors.length === 0}
          errorString="Al menos un autor es requerido"
          placeholder="Ingrese autores separados por comas"
          id="authors"
          name="authors"
          value={authors.join(',')}
          type="text"
          required={false}
          onChange={(e) => setAuthors(e.target.value.split(','))}
        />
        <button
          type="button"
          className="btn-outline inline-flex gap-2 items-center w-full md:w-fit justify-center py-2 px-4 my-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-50 bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={(e) => {
            e.preventDefault()
            const myAuthors = authors.map((author) => author.trim())
            const uniqueAuthors = myAuthors.filter(
              (author) =>
                !changeableAuthors.includes(author) && author !== '',
            )
            setChangeableAuthors([...changeableAuthors, ...uniqueAuthors])
            setAuthors([])
          }}
        >
          <Plus size={16} />
          <span>Agregar</span>
        </button>
      </section>
      <section className="flex flex-wrap gap-2 items-center justify-evenly">
        {changeableAuthors.map((author) => (
          <button
            type="button"
            key={author + 'added_author'}
            className="w-1/3 md:w-fit group flex items-center justify-between bg-gray-200 text-gray-800 hover:text-gray-950  hover:border hover:border-gray-800 hover:bg-gray-400 text-sm font-semibold px-2 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
            onClick={() => {
              setChangeableAuthors(
                changeableAuthors.filter((a) => a !== author),
              )
            }}
          >
            <span className="text-gray-800 group-hover:text-gray-950 group-hover:text-md">
              {author.trim() === '' ? 'Autor sin nombre' : author}
            </span>
            <span className="ml-2 text-red-500 group-hover:text-red-700 group-hover:text-xl">
              x
            </span>
          </button>
        ))}
      </section>

      <section className="md:flex md:items-center md:justify-between md:space-x-4">
        <Label
          htmlFor="primaryThematicAxis"
          error={formErrors.primaryThematicAxis}
          text="Eje principal*"
        />
        <Select
          error={formErrors.primaryThematicAxis}
          errorString="El eje temático es requerido"
          optionDefaultText="Seleccione un eje principal"
          id="primaryThematicAxis"
          name="primaryThematicAxis"
          value={primaryThematicAxis}
          onChange={(e) => setPrimaryThematicAxis(e.target.value)}
          required={true}
          options={primaryThematicOptions}
        />
      </section>

      <section className="md:flex md:items-center md:justify-between md:space-x-4">
        <Label
          htmlFor="secondaryThematicAxis"
          error={false}
          text="Eje secundario (opcional)"
        />
        <Select
          error={false}
          optionDefaultText="Seleccione un eje secundario"
          id="secondaryThematicAxis"
          name="secondaryThematicAxis"
          value={secondaryThematicAxis}
          onChange={(e) => setSecondaryThematicAxis(e.target.value)}
          required={false}
          options={secondaryThematicOptions}
        />
      </section>

      <section className="md:flex md:items-center md:justify-between md:space-x-4">
        <Label
          htmlFor="keywords"
          error={formErrors.keywords && changeableKeywords.length === 0}
          text="Palabras clave*"
        />
        <Input
          error={formErrors.keywords && changeableKeywords.length === 0}
          errorString="Las palabras clave son requeridas"
          placeholder="Ingrese palabras clave separadas por comas"
          id="keywords"
          name="keywords"
          value={keywords.join(',')}
          type="text"
          required={false}
          onChange={(e) => setKeywords(e.target.value.split(','))}
        />
        <button
          type="button"
          className="btn-outline inline-flex gap-2 items-center w-full md:w-fit justify-center py-2 px-4 my-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-50 bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={(e) => {
            e.preventDefault()
            const myKeywords = keywords.map((keyword) => keyword.trim())
            const uniqueKeywords = myKeywords.filter(
              (keyword) =>
                !changeableKeywords.includes(keyword) && keyword !== '',
            )
            setChangeableKeywords([
              ...changeableKeywords,
              ...uniqueKeywords,
            ])
            setKeywords([])
          }}
        >
          <Plus size={16} />
          <span>Agregar</span>
        </button>
      </section>
      <section className="flex flex-wrap gap-2 items-center justify-evenly">
        {changeableKeywords.map((keyword) => (
          <button
            type="button"
            key={keyword + 'added_keyword'}
            className="w-1/3 md:w-fit group flex items-center justify-between bg-gray-200 text-gray-800 hover:text-gray-950  hover:border hover:border-gray-800 hover:bg-gray-400 text-sm font-semibold px-2 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
            onClick={() => {
              setChangeableKeywords(
                changeableKeywords.filter((k) => k !== keyword),
              )
            }}
          >
            <span className="text-gray-800 group-hover:text-gray-800 group-hover:text-md">
              {keyword.trim() === '' ? 'Palabra clave sin nombre' : keyword}
            </span>
            <span className="ml-2 text-red-500 group-hover:text-red-700 group-hover:text-xl">
              x
            </span>
          </button>
        ))}
      </section>

      <section className="md:space-x-4">
        <Label
          htmlFor="summary"
          error={formErrors.summary}
          text="Resumen*"
        />
        <TextArea
          error={formErrors.summary}
          errorString="El resumen es requerido"
          placeholder="Ingrese el resumen del artículo"
          id="summary"
          name="summary"
          value={summary}
          required={true}
          onChange={(e) => setSummary(e.target.value)}
        />
      </section>

      <span className="flex text-gray-500 text-sm font-semibold my-2 items-center justify-between">
        <span>Archivo actual</span>
        {
          fileName ? (
            <span className="text-gray-500">{extractFileNameFromPath(fileName)}</span>
          ) : (
            <span className="text-gray-500">No hay archivo subido</span>
          )
        }
      </span>
      <section className="md:flex md:items-center md:justify-between md:space-x-4">
        <Label htmlFor="file" error={fileError} text="Archivo PDF*" />
        <input
          type="file"
          id="file"
          name="file"
          required={false}
          accept="application/pdf"
          onChange={handleFileChange}
          className={`block p-3 w-full md:w-3/4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center ${fileError ? 'border-red-500' : ''}`}
        />
        {fileError && (
          <span className="text-red-500">
            Por favor, suba un archivo PDF válido.
          </span>
        )}
      </section>

      <section className="md:flex md:items-center md:justify-between md:space-x-4">
        <Label
          htmlFor="practiceReport"
          error={false}
          text="Informe relacionado (opcional)"
        />
        <Select
          error={false}
          id="practiceReport"
          name="practiceReport"
          value={practiceReportId}
          onChange={(e) => setPracticeReportId(e.target.value)}
          required={false}
          options={[
            {
              label: 'Seleccione un informe relacionado',
              value: '',
              key: 'no_practice_report',
            },
            ...practiceReports.map((item) => ({
              label: item.title,
              value: item._id,
              key: item._id + 'practice_report_ar',
            })),
          ]}
        />
      </section>

      <section className="flex justify-end space-x-2 mt-4 pb-4">
        <button
          type="button"
          className="btn-outline inline-flex w-full md:w-fit justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            onClose(false)
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full md:w-fit justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {buttonText}
        </button>
      </section>
    </form>
  )
}

export default ArticleEdit
