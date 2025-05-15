import { useEffect, useState } from 'react'
import PracticeReport, { PracticeReportUpdate } from '../entities/PracticeReport'
import Swal from 'sweetalert2'
import Input from '../../../shared/components/common/Input'
import Label from '../../../shared/components/common/Label'
import { Plus } from 'lucide-react'
import Select from '../../../shared/components/common/Select'
import { thematicOptions } from '../../../shared/constants/cts'
import Article from '../../articles/entities/Article'
import Institution from '../../institutions/entities/Institution'
import { articleService } from '../../articles/services/ArticlesService'
import { institutionService } from '../../institutions/services/InstitutionService'
import { practiceService } from '../services/PraticeReportService'

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


interface PracticeReportEditProps {
  practiceReport: PracticeReport
  onClose: (value: boolean) => void
  setUpdatedPracticeReports: (practiceReports: PracticeReport[]) => void
}
function PracticeReportEdit({ practiceReport, onClose }: Readonly<PracticeReportEditProps>) {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])

  const [title, setTitle] = useState(practiceReport.title)
  const [yearSemester, setYearSemester] = useState(practiceReport.period)
  const [authors, setAuthors] = useState<string[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [file, setFile] = useState<File | null>(practiceReport.file ?? null)
  const [fileName, setFileName] = useState(practiceReport.fileAddress)
  const [fileError, setFileError] = useState(false)
  const [changeableKeywords, setChangeableKeywords] = useState(
    practiceReport.keywords,
  )
  const [changeableAuthors, setChangeableAuthors] = useState(
    practiceReport.authors,
  )
  const [primaryThematicAxis, setPrimaryThematicAxis] = useState(practiceReport.primaryThematicAxis)
  const [secondaryThematicAxis, setSecondaryThematicAxis] = useState(practiceReport.secondaryThematicAxis ?? '')
  const [institutionId, setInstitutionId] = useState(practiceReport.institution)
  const [articleId, setArticleId] = useState(practiceReport.researchArticle ?? '')

  const [formErrors, setFormErrors] = useState({
    title: false,
    yearSemester: false,
    authors: false,
    primaryThematicAxis: false,
    keywords: false,
    institutionId: false,
  })

  useEffect(() => {
    void articleService.getAll().then((res) => {
      setArticles(res.data)
    })
    void institutionService.getAll().then((res) => {
      setInstitutions(res.data)
    })
  }, [])

  // Función para extraer el nombre del archivo de una ruta
  const extractFileNameFromPath = (path: string): string => {
    if (!path) return ''
    return path.split('/').pop() ?? ''
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      // Extraer el nombre del archivo actual de fileAddress
      const currentFileName = extractFileNameFromPath(practiceReport.fileAddress ?? '')

      // Si el nombre del nuevo archivo es igual al actual, mostrar una advertencia
      if (file.name === currentFileName) {
        void Swal.fire({
          title: 'Atención',
          text: 'El nombre del archivo es el mismo que el actual. Considera renombrarlo para evitar problemas.',
          icon: 'warning',
          confirmButtonText: 'Entendido',
        })
      }

      setFile(file)
      setFileName(file.name)
      setFileError(false)
    } else {
      setFile(null)
      setFileName('')
      if (!fileName) {
        setFileError(true)
      }
    }
  }

  const resetForm = () => {
    setTitle('')
    setAuthors([])
    setPrimaryThematicAxis('')
    setSecondaryThematicAxis('')
    setYearSemester('')
    setKeywords([])
    setChangeableAuthors([])
    setChangeableKeywords([])
    setInstitutionId('')
    setArticleId('')
    setFileError(false)
    setFile(null)
    setFormErrors({
      title: false,
      yearSemester: false,
      authors: false,
      primaryThematicAxis: false,
      keywords: false,
      institutionId: false,
    })
  }

  const validateForm = (): boolean => {
    const errors = {
      title: !title.trim(),
      yearSemester: !yearSemester.trim() || !validateYearSemester(yearSemester),
      authors: !changeableAuthors.length,
      primaryThematicAxis: !primaryThematicAxis,
      keywords: !changeableKeywords.length,
      institutionId: !institutionId,
    }

    setFormErrors(errors)
    return !Object.values(errors).some(Boolean)
  }

  // Validar formato yearSemester (YYYY-1 o YYYY-2)
  const validateYearSemester = (value: string): boolean => {
    const regex = /^\d{4}-[1-2]$/
    return regex.test(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage('')
    setErrorMessage('')

    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    if (!file && !fileName) {
      setFileError(true)
      setIsSubmitting(false)
      return
    }

    try {
      // Crear el objeto para la actualización
      const practiceReportData: PracticeReportUpdate = {
        _id: practiceReport._id,
        title: title.trim(),
        period: yearSemester.trim(),
        authors: changeableAuthors.join(','),
        keywords: changeableKeywords.join(','),
        institutionId: institutionId,
        primaryThematicAxis: primaryThematicAxis,
      }

      if (secondaryThematicAxis) {
        practiceReportData.secondaryThematicAxis = secondaryThematicAxis
      }

      if (articleId) {
        practiceReportData.researchArticle = articleId
      }

      // Usar el servicio para actualizar el informe
      await practiceService.update(practiceReport._id, practiceReportData,
        // file ?? undefined
      )
        .then(() => {
          setSuccessMessage('Informe de práctica editado correctamente')
          void Swal.fire({
            title: 'Informe editado',
            text: 'El informe de práctica ha sido editado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          })

          onClose(false)
          resetForm()
          window.location.reload()
        })
    } catch (error) {
      console.error('Error al editar el informe de práctica:', error)
      setErrorMessage('Error al editar el informe de práctica')
      void Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al editar el informe de práctica. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      })
    } finally {
      setIsSubmitting(false)
      resetForm()
    }
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
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      <section className="md:flex md:items-center md:justify-between md:space-x-4">
        <Label htmlFor="title" error={formErrors.title} text="Título*" />
        <Input
          error={formErrors.title}
          errorString="El título es requerido"
          placeholder="Ingrese el título del informe"
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
        <Label htmlFor="yearSemester" error={formErrors.yearSemester} text="Año-Semestre*" />
        <Input
          error={formErrors.yearSemester}
          errorString="Formato requerido YYYY-1 o YYYY-2 (ej: 2024-1)"
          placeholder="Ingrese año-semestre (YYYY-1 o YYYY-2)"
          id="yearSemester"
          name="yearSemester"
          value={yearSemester}
          type="text"
          pattern="\d{4}-[1-2]"
          required={false}
          onChange={(e) => setYearSemester(e.target.value)}
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
          htmlFor="mainAxis"
          error={formErrors.primaryThematicAxis}
          text="Eje principal*"
        />
        <Select
          error={formErrors.primaryThematicAxis}
          errorString="El eje principal es requerido"
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
          htmlFor="secondaryAxis"
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

      <section className="md:flex md:items-center md:justify-between md:space-x-4">
        <Label
          htmlFor="institutionId"
          error={formErrors.institutionId}
          text="Institución*"
        />
        <Select
          error={formErrors.institutionId}
          errorString="La institución es requerida"
          optionDefaultText="Seleccione una institución"
          id="institutionId"
          name="institutionId"
          value={institutionId}
          onChange={(e) => setInstitutionId(e.target.value)}
          required={true}
          options={[
            {
              label: 'Seleccione una institución',
              value: '',
              key: 'no_institution',
            },
            ...institutions.map((item) => ({
              label: item.name,
              value: item._id,
              key: item._id + 'institution',
            })),
          ]}
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
          htmlFor="articleId"
          error={false}
          text="Artículo relacionado (opcional)"
        />
        <Select
          error={false}
          id="articleId"
          name="articleId"
          value={articleId}
          onChange={(e) => setArticleId(e.target.value)}
          required={false}
          options={[
            {
              label: 'Seleccione un artículo relacionado',
              value: '',
              key: 'no_article',
            },
            ...articles.map((item) => ({
              label: item.title,
              value: item._id,
              key: item._id + 'article_pr',
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

export default PracticeReportEdit
