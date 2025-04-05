import { useState, useEffect } from 'react'
import { Dialog } from '../../components/common/dialog/Dialog'
import { DialogContent } from '../../components/common/dialog/DialogContent'
import { DialogHeader } from '../../components/common/dialog/DialogHeader'
import { DialogTitle } from '../../components/common/dialog/DialogTitle'
import Article from '../../../types/entities/Article'
import { DialogTrigger } from '../../components/common/dialog/DialogTrigger'
import { Plus } from 'lucide-react'
import { DialogDescription } from '../../components/common/dialog/DialogDescription'
import Input from '../../components/common/Input'
import Label from '../../components/common/Label'
import Select from '../../components/common/Select'
import TextArea from '../../components/common/TextArea'
import { thematicOptions } from '../../../constants/cts'
// import { useArticles } from '@/context/ArticleContext'
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
  // const { addArticle, editArticle } = useArticles()
  const [open, onClose] = useState(false)
  const [title, setTitle] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [authors, setAuthors] = useState('')
  const [summary, setSummary] = useState('')
  const [keywords, setKeywords] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState(false) // Estado para errores del archivo
  const [changeableKeywords, setChangeableKeywords] = useState(
    article?.changeableKeywords ?? article?.keywords.split(', ') ?? [],
  )
  const [changeableAuthors, setChangeableAuthors] = useState(
    article?.changeableAuthors ?? article?.authors.split(', ') ?? [],
  )
  const [thematicArea, setThematicArea] = useState('')
  const [thematicArea2, setThematicArea2] = useState('')
  const [practiceReportId, setPracticeReportId] = useState('')
  const [practiceReport, setPracticeReport] = useState('')
  const [formErrors, setFormErrors] = useState({
    title: false,
    year: false,
    authors: false,
    thematicArea: false,
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
      setThematicArea(article.thematicArea)
      setKeywords(article.keywords)
      setFile(article.file)
      setThematicArea2(article.thematicArea2 ?? '')
      setPracticeReportId(article.practiceReportId ?? '')
      setChangeableAuthors(article.changeableAuthors ?? [])
      setChangeableKeywords(article.changeableKeywords ?? [])
    } else {
      // Clear form when opening in add mode
      resetForm()
    }
  }, [])

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
    setAuthors('')
    setThematicArea('')
    setThematicArea2('')
    setYear(new Date().getFullYear().toString())
    setSummary('')
    setKeywords('')
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
      thematicArea: false,
      summary: false,
      keywords: false,
    })
  }

  const validateForm = (): boolean => {
    const errors = {
      title: !title.trim(),
      year: !year.trim(),
      authors: !changeableAuthors.length,
      thematicArea: !thematicArea,
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
      authors: changeableAuthors.join(', '),
      year: year.trim(),
      thematicArea: thematicArea,
      summary: summary.trim(),
      keywords: changeableKeywords.join(', '),
      file: file,
    }

    if (practiceReportId) {
      articleData.practiceReportId = practiceReportId
    }

    if (thematicArea2) {
      articleData.thematicArea2 = thematicArea2
    }

    // @typescript-eslint/no-unnecessary-condition
    if (mode === 'add') {
      // addArticle(articleData)
    } else if (mode === 'edit' && article) {
      // editArticle(article.id, articleData)
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
        className="sm:max-w-[600px] m-auto h-screen"
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
              value={authors}
              type="text"
              required={false}
              onChange={(e) => setAuthors(e.target.value)}
            />
            <button
              type="button"
              className="btn-outline inline-flex gap-2 items-center w-full md:w-fit justify-center py-2 px-4 my-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-50 bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={(e) => {
                e.preventDefault()
                if (!authors) return
                const allAuthors = authors.split(',')
                const uniqueAuthors = allAuthors.filter(
                  (author) =>
                    !changeableAuthors.includes(author) && author.trim() !== '',
                )
                setChangeableAuthors([...changeableAuthors, ...uniqueAuthors])
                setAuthors('')
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
                <span className="text-gray-800 group-hover:text-gray-800 group-hover:text-md">
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
              htmlFor="thematicArea"
              error={formErrors.thematicArea}
              text="Eje principal*"
            />
            <Select
              error={formErrors.thematicArea}
              errorString="El eje temático es requerido"
              optionDefaultText="Seleccione un eje principal"
              id="thematicArea"
              name="thematicArea"
              value={thematicArea}
              onChange={(e) => setThematicArea(e.target.value)}
              required={true}
              options={primaryThematicOptions}
            />
          </section>

          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label
              htmlFor="thematicArea2"
              error={false}
              text="Eje secundario (opcional)"
            />
            <Select
              error={false}
              optionDefaultText="Seleccione un eje secundario"
              id="thematicArea2"
              name="thematicArea2"
              value={thematicArea2}
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
              value={keywords}
              type="text"
              required={false}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <button
              type="button"
              className="btn-outline inline-flex gap-2 items-center w-full md:w-fit justify-center py-2 px-4 my-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-50 bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={(e) => {
                e.preventDefault()
                if (!keywords) return
                const allKeywords = keywords.split(',')
                const uniqueKeywords = allKeywords.filter(
                  (keyword) =>
                    !changeableKeywords.includes(keyword) &&
                    keyword.trim() !== '',
                )
                setChangeableKeywords([
                  ...changeableKeywords,
                  ...uniqueKeywords,
                ])
                setKeywords('')
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
