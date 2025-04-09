import { useState, useEffect } from 'react'
import { Dialog } from '../../../shared/components/common/dialog/Dialog'
import { DialogContent } from '../../../shared/components/common/dialog/DialogContent'
import { DialogHeader } from '../../../shared/components/common/dialog/DialogHeader'
import { DialogTitle } from '../../../shared/components/common/dialog/DialogTitle'
import Article from '../../../shared/types/entities/Article'
import { DialogTrigger } from '../../../shared/components/common/dialog/DialogTrigger'
import { Plus } from 'lucide-react'
import { DialogDescription } from '../../../shared/components/common/dialog/DialogDescription'
import Input from '../../../shared/components/common/Input'
import Label from '../../../shared/components/common/Label'
import Select from '../../../shared/components/common/Select'
import TextArea from '../../../shared/components/common/TextArea'
import { thematicOptions } from '../../../shared/constants/cts'
import Swal from 'sweetalert2'
import { useArticleStore } from '../stores/ArticlesStore'

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
interface ArticleFormProps {
  article?: Article
  mode: 'add' | 'edit'
}
const ArticleForm: React.FC<ArticleFormProps> = ({ article, mode }) => {
  const { addArticle, editArticle } = useArticleStore()
  const [open, onClose] = useState(false)
  const [title, setTitle] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [authors, setAuthors] = useState<string[]>([])
  const [summary, setSummary] = useState('')
  const [keywords, setKeywords] = useState<string[]>()
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState(false) // Estado para errores del archivo
  const [changeableKeywords, setChangeableKeywords] = useState(
    article?.changeableKeywords ?? [],
  )
  const [changeableAuthors, setChangeableAuthors] = useState(
    article?.changeableAuthors ?? [],
  )
  const [primaryThematicAxis, setThematicArea] = useState('')
  const [secondaryThematicAxis, setThematicArea2] = useState('')
  const [practiceReportId, setPracticeReportId] = useState('')
  const [practiceReport, setPracticeReport] = useState('')
  const [formErrors, setFormErrors] = useState({
    title: false,
    year: false,
    authors: false,
    primaryThematicAxis: false,
    summary: false,
    keywords: false,
    // changeableAuthors: false,
  })

  useEffect(() => {
    if (article && mode === 'edit') {
      setTitle(article.title)
      setYear(article.year)
      setAuthors(article.authors)
      setSummary(article.summary)
      setThematicArea(article.primaryThematicAxis)
      setKeywords(article.keywords)
      // setFile(article?.file ?? null)
      setThematicArea2(article.secondaryThematicAxis ?? '')
      setPracticeReportId(article.practiceReportId ?? '')
      setChangeableAuthors(article.changeableAuthors ?? [])
      setChangeableKeywords(article.changeableKeywords ?? [])
    } else {
      // Clear form when opening in add mode
      resetForm()
    }
  }, [article, mode])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setFile(file)
      setFileError(false)
    } else {
      setFile(null)
      setFileError(true)
    }
  }

  const resetForm = () => {
    setTitle('')
    setAuthors([])
    setThematicArea('')
    setThematicArea2('')
    setYear(new Date().getFullYear().toString())
    setSummary('')
    setKeywords([])
    setChangeableAuthors([])
    setChangeableKeywords([])
    setPracticeReportId('')
    setPracticeReport('')
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!file) {
      setFileError(true)
      return
    }

    const articleData: Article = {
      title: title.trim(),
      authors: changeableAuthors,
      year: year.trim(),
      primaryThematicAxis: primaryThematicAxis,
      summary: summary.trim(),
      keywords: changeableKeywords,
      file: file,
    }

    if (practiceReportId) {
      articleData.practiceReportId = practiceReportId
    }

    if (secondaryThematicAxis) {
      articleData.secondaryThematicAxis = secondaryThematicAxis
    }

    if (mode === 'add') {
      void addArticle(articleData).then(() => {
        onClose(false)
        void Swal.fire({
          title: 'Artículo agregado',
          text: 'El artículo ha sido agregado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        })
      })
    } else if (article?._id) {
      void editArticle(article._id, articleData).then(() => {
        onClose(false)
        void Swal.fire({
          title: 'Artículo editado',
          text: 'El artículo ha sido editado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        })
      })
    }

    resetForm()
  }

  return (
    <Dialog
      open={open}
      setOpen={onClose}
      className="relative md:absolute md:right-0 mb-3"
    >
      <DialogTrigger setOpen={onClose} className="w-full">
        <section className="flex w-full md:w-fit items-center justify-center gap-2 p-2 border rounded-lg text-white bg-blue-500 border-gray-50 hover:bg-gray-600 hover:border-gray-800">
          <Plus className="md:mr-2 h-4 w-4" />
          <p>{mode === 'add' ? 'Agregar' : 'Editar'} articulo</p>
        </section>
      </DialogTrigger>
      <DialogContent
        open={open}
        setOpen={onClose}
        className="max-w-md sm:max-w-xl md:max-w-2xl m-auto h-screen"
      >
        <DialogHeader>
          <DialogTitle>
            {mode === 'add'
              ? 'Registrar un nuevo artículo de investigación'
              : 'Edita el artículo'}
          </DialogTitle>
          <DialogDescription>
            <span>
              Completa los detalles del articulo. El eje secundario es opcional.
            </span>
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
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
              max={new Date().getFullYear() + 1}
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
              value={authors.join(', ')}
              type="text"
              required={false}
              onChange={(e) =>
                setAuthors(
                  e.target.value.split(',').map((author) => author.trim()),
                )
              }
            />
            <button
              type="button"
              className="btn-outline inline-flex gap-2 items-center w-full md:w-fit justify-center py-2 px-4 my-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-50 bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={(e) => {
                e.preventDefault()
                const uniqueAuthors = authors.filter(
                  (author) =>
                    !changeableAuthors.includes(author) && author.trim() !== '',
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
              onChange={(e) => setThematicArea(e.target.value)}
              required={true}
              options={primaryThematicOptions}
            />
          </section>

          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label
              htmlFor="secondaryThematicAxis "
              error={false}
              text="Eje secundario (opcional)"
            />
            <Select
              error={false}
              optionDefaultText="Seleccione un eje secundario"
              id="secondaryThematicAxis "
              name="secondaryThematicAxis "
              value={secondaryThematicAxis}
              onChange={(e) => setThematicArea2(e.target.value)}
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
              value={keywords?.join(', ') ?? ''}
              type="text"
              required={false}
              onChange={(e) =>
                setKeywords(
                  e.target.value.split(',').map((keyword) => keyword.trim()),
                )
              }
            />
            <button
              type="button"
              className="btn-outline inline-flex gap-2 items-center w-full md:w-fit justify-center py-2 px-4 my-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-50 bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={(e) => {
                e.preventDefault()
                if (!keywords) return
                const uniqueKeywords = keywords.filter(
                  (keyword) =>
                    !changeableKeywords.includes(keyword) &&
                    keyword.trim() !== '',
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

          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label htmlFor="file" error={fileError} text="Archivo PDF*" />
            <input
              type="file"
              id="file"
              name="file"
              required={true}
              accept="application/pdf"
              onChange={handleFileChange}
              className={`block p-3 w-full md:w-3/4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center ${
                fileError ? 'border-red-500' : ''
              }`}
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
              value={practiceReport}
              onChange={(e) => setPracticeReport(e.target.value)}
              required={false}
              options={[
                {
                  value: '',
                  label: 'Seleccione un informe de práctica',
                  key: '',
                },
                {
                  value: 'Informe 1',
                  label: 'Informe 1',
                  key: 'informe1',
                },
                {
                  value: 'Informe 2',
                  label: 'Informe 2',
                  key: 'informe2',
                },
                {
                  value: 'Informe 3',
                  label: 'Informe 3',
                  key: 'informe3',
                },
              ]}
            />
          </section>

          <section className="flex justify-end space-x-2 mt-4 pb-4">
            <button
              type="button"
              className="btn-outline inline-flex w-full md:w-fit justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => onClose(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex w-full md:w-fit justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {mode === 'add' ? 'Agregar' : 'Guardar cambios'}
            </button>
          </section>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ArticleForm
