import { useState, useEffect } from 'react'
import { Dialog } from '../../../shared/components/common/dialog/Dialog'
import { DialogContent } from '../../../shared/components/common/dialog/DialogContent'
import { DialogHeader } from '../../../shared/components/common/dialog/DialogHeader'
import { DialogTitle } from '../../../shared/components/common/dialog/DialogTitle'
import PracticeReport, { PracticeReportCreate } from '../entities/PracticeReport'
import { DialogTrigger } from '../../../shared/components/common/dialog/DialogTrigger'
import { Plus } from 'lucide-react'
import { DialogDescription } from '../../../shared/components/common/dialog/DialogDescription'
import Input from '../../../shared/components/common/Input'
import Label from '../../../shared/components/common/Label'
import Select from '../../../shared/components/common/Select'
import { thematicOptions } from '../../../shared/constants/cts'
import Swal from 'sweetalert2'
import { usePracticeReportStore } from '../stores/PracticeReportsStore'
import { articleService } from '../../articles/services/ArticlesService'
import Article from '../../articles/entities/Article'
import { institutionService } from '../../institutions/services/InstitutionService'

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
const DEFAULT_ERRORS = {
  title: false,
  year: false,
  semester: false,
  period: false,
  authors: false,
  primaryThematicAxis: false,
  keywords: false,
  institution: false,
}

interface PracticeReportFormProps {
  practiceReport?: PracticeReport
  mode: 'add' | 'edit'
}

const PracticeReportForm: React.FC<PracticeReportFormProps> = ({ practiceReport, mode }) => {
  const [institutions, setInstitutions] = useState<{ label: string; value: string; key: string }[]>([])

  useEffect(() => {
    void institutionService.getAll().then(res => {
      const institutionOptions = res.data.map((institution: { _id: string; name: string }) => ({
        label: institution.name,
        value: institution._id,
        key: institution._id,
      }))
      setInstitutions(institutionOptions)
    })
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addPracticeReport, editPracticeReport } = usePracticeReportStore()
  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [semester, setSemester] = useState('1')
  const [period, setPeriod] = useState(year + '-' + semester)
  const [institution, setInstitution] = useState('')
  const [authors, setAuthors] = useState<string[]>([])
  const [changeableAuthors, setChangeableAuthors] = useState(practiceReport?.changeableAuthors ?? [])
  const [keywords, setKeywords] = useState<string[]>([])
  const [changeableKeywords, setChangeableKeywords] = useState(practiceReport?.changeableKeywords ?? [])
  const [summary, setSummary] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState(false)
  const [primaryThematicAxis, setPrimaryThematicAxis] = useState('')
  const [secondaryThematicAxis, setSecondaryThematicAxis] = useState('')
  const [articleId, setArticleId] = useState('')
  const [formErrors, setFormErrors] = useState(DEFAULT_ERRORS)

  const [articles, setArticles] = useState<Article[]>([])
  useEffect(() => {
    void articleService.getAll().then(res => setArticles(res.data))
  }, [])

  useEffect(() => {
    console.log('====================================')
    console.log(institution)
    console.log('====================================')
  }, [institution])

  useEffect(() => {
    if (practiceReport && mode === 'edit') {
      setTitle(practiceReport.title)
      setYear(practiceReport.period.split('-')[0])
      setSemester(practiceReport.period.split('-')[1])
      setInstitution(practiceReport.institution)
      setPeriod(practiceReport.period)
      setChangeableAuthors(practiceReport.authors)
      setChangeableKeywords(practiceReport.keywords)
      setPrimaryThematicAxis(practiceReport.primaryThematicAxis)
      setSecondaryThematicAxis(practiceReport.secondaryThematicAxis ?? '')
      setArticleId(practiceReport.researchArticle ?? '')
    } else {
      resetForm()
    }
  }, [practiceReport, mode])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f?.type === 'application/pdf') {
      setFile(f)
      setFileError(false)
    } else {
      setFile(null)
      setFileError(true)
    }
  }

  const resetForm = () => {
    setTitle('')
    setYear(new Date().getFullYear().toString())
    setSemester('1')
    setPeriod(new Date().getFullYear().toString() + '-1')
    setChangeableAuthors([])
    setChangeableKeywords([])
    setSummary('')
    setPrimaryThematicAxis('')
    setSecondaryThematicAxis('')
    setArticleId('')
    setInstitution('')
    setFile(null)
    setFileError(false)
    setFormErrors(DEFAULT_ERRORS)
  }

  const validateForm = () => {
    const errors = {
      title: !title.trim(),
      year: !year.trim() || isNaN(Number(year)) || Number(year) > new Date().getFullYear(),
      semester: !semester.trim() || (semester !== '1' && semester !== '2'),
      period: !period.trim(),
      authors: !changeableAuthors.length,
      primaryThematicAxis: !primaryThematicAxis,
      summary: !summary.trim(),
      keywords: !changeableKeywords.length,
      institution: !institution.trim(),
    }
    setFormErrors(errors)
    return !Object.values(errors).some(Boolean)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }
    if (!file) {
      setFileError(true)
      setIsSubmitting(false)
      return
    }

    const reportData: PracticeReportCreate = {
      title: title.trim(),
      period: year.trim(),
      primaryThematicAxis: primaryThematicAxis.trim(),
      keywords: changeableKeywords,
      authors: changeableAuthors,
      file: file,
      researchArticle: articleId,
      ...(secondaryThematicAxis && { secondaryThematicAxis }),
      institutionId: institution.trim(),
    }

    if (mode === 'add') {
      try {
        await addPracticeReport(reportData)
        await Swal.fire({ title: 'Informe agregado', text: 'El informe práctico se agregó exitosamente.', icon: 'success', confirmButtonText: 'Aceptar' })
        setOpen(false)
        window.location.reload()
      } finally {
        setIsSubmitting(false)
      }
    } else if (practiceReport?._id) {
      await editPracticeReport(practiceReport._id, {
        ...reportData,
        _id: practiceReport._id,
        institution: practiceReport.institution // Ensure institution is included
      })
      setOpen(false)
      await Swal.fire({ title: 'Informe editado', text: 'El informe práctico se editó exitosamente.', icon: 'success', confirmButtonText: 'Aceptar' })
      setIsSubmitting(false)
    }
  }

  let buttonText = 'Guardar cambios'
  if (isSubmitting) {
    buttonText = 'Cargando...'
  } else if (mode === 'add') {
    buttonText = 'Agregar'
  }

  return (
    <Dialog open={open} setOpen={setOpen} className="relative md:absolute md:right-0 mb-3">
      <DialogTrigger setOpen={setOpen} className="w-full">
        <section className="flex w-full md:w-fit items-center justify-center gap-2 p-2 border rounded-lg text-white bg-blue-500 hover:bg-blue-600">
          <Plus className="h-4 w-4" />
          <p>{mode === 'add' ? 'Agregar informe' : 'Editar informe'}</p>
        </section>
      </DialogTrigger>
      <DialogContent open={open} setOpen={setOpen} className="max-w-md sm:max-w-xl md:max-w-2xl m-auto h-screen">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Registrar nuevo informe práctico' : 'Edita el informe práctico'}
          </DialogTitle>
          <DialogDescription>Completa los detalles del informe. El eje secundario es opcional.</DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5 mt-4 px-1 md:px-4 h-[83vh]">
          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label htmlFor="title" error={formErrors.title} text="Título*" />
            <Input
              error={formErrors.title}
              errorString="El título es requerido"
              placeholder="Ingrese el título del informe"
              id="title"
              name="title"
              minLength={3}
              maxLength={255}
              value={title}
              type="text"
              required
              onChange={e => setTitle(e.target.value)}
            />
          </section>

          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <section className='md:flex md:items-center md:justify-between md:space-x-4 md:w-1/2 '>

              <Label htmlFor="year" error={formErrors.year} text="Año*" />
              <Input
                required
                error={formErrors.year}
                errorString="El año es requerido"
                placeholder="Ingrese (YYYY) el año de publicación"
                id="year"
                name="year"
                value={year}
                type="number"
                pattern="\\d{4}"
                min={1950}
                max={new Date().getFullYear()}
                onChange={e => setYear(e.target.value)}
              />
            </section>
            <section className='md:flex md:items-center md:justify-between md:space-x-4 md:w-1/2'>
              <Label htmlFor="semester" error={formErrors.semester} text="Semestre*" />
              <Select
                required
                error={formErrors.semester}
                errorString="El semestre es requerido"
                id="semester"
                name="semester"
                value={semester}
                onChange={e => setSemester(e.target.value)}
                options={[{ label: '1', value: '1', key: 'semester_1' }, { label: '2', value: '2', key: 'semester_2' }]}
              />
            </section>
          </section>

          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label htmlFor="authors" error={formErrors.authors} text="Autor(es)*" />
            <Input
              required={false}
              error={formErrors.authors}
              errorString="Al menos un autor es requerido"
              placeholder="Ingrese autores separados por comas"
              id="authors"
              name="authors"
              value={authors.join(',')}
              type="text"
              onChange={e => setAuthors(e.target.value.split(','))}
            />
            <button
              type="button"
              className="btn-outline inline-flex gap-2 items-center justify-center py-2 px-4"
              onClick={e => {
                e.preventDefault()
                const trimmed = authors.map(a => a.trim()).filter(a => a)
                const unique = trimmed.filter(a => !changeableAuthors.includes(a))
                setChangeableAuthors([...changeableAuthors, ...unique])
                setAuthors([])
              }}
            >
              <Plus size={16} /> Agregar
            </button>
          </section>

          <section className="flex flex-wrap gap-2">
            {changeableAuthors.map(a => (
              <button
                key={a}
                type="button"
                className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded"
                onClick={() => setChangeableAuthors(changeableAuthors.filter(x => x !== a))}
              >
                {a} <span className="text-red-500">x</span>
              </button>
            ))}
          </section>

          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label htmlFor="primaryThematicAxis" error={formErrors.primaryThematicAxis} text="Eje principal*" />
            <Select
              required
              error={formErrors.primaryThematicAxis}
              errorString="El eje temático es requerido"
              id="primaryThematicAxis"
              name="primaryThematicAxis"
              value={primaryThematicAxis}
              onChange={e => setPrimaryThematicAxis(e.target.value)}
              options={[
                { label: 'Seleccione un eje temático', value: '', key: 'no_primary_area' },
                ...primaryThematicOptions.filter(option => option.value !== secondaryThematicAxis)
              ]}
            />
          </section>

          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label htmlFor="secondaryThematicAxis" error={false} text="Eje secundario (opcional)" />
            <Select
              required
              error={false}
              id="secondaryThematicAxis"
              name="secondaryThematicAxis"
              value={secondaryThematicAxis}
              onChange={e => setSecondaryThematicAxis(e.target.value)}
              options={[
                { label: 'Seleccione un eje temático secundario', value: '', key: 'no_secondary_area' },
                ...secondaryThematicOptions.filter(option => option.value !== primaryThematicAxis)
              ]}
            />
          </section>

          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label htmlFor="institution" error={formErrors.institution} text="Institucion educativa*" />
            <Select
              required
              error={formErrors.institution}
              errorString="La institucion es requerida"
              id="institution"
              name="institution"
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              options={[
                { label: 'Seleccione una institución', value: '', key: 'no_institution' },
                ...(Array.isArray(institutions) ? institutions : [])
              ]} />
          </section>

          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label htmlFor="keywords" error={formErrors.keywords} text="Palabras clave*" />
            <Input
              required={false}
              error={formErrors.keywords}
              errorString="Las palabras clave son requeridas"
              placeholder="Ingrese palabras clave separadas por comas"
              id="keywords"
              name="keywords"
              value={keywords.join(',')}
              type="text"
              onChange={e => setKeywords(e.target.value.split(','))}
            />
            <button
              type="button"
              className="btn-outline inline-flex gap-2 items-center justify-center py-2 px-4"
              onClick={e => {
                e.preventDefault()
                const trimmed = keywords.map(k => k.trim()).filter(k => k)
                const unique = trimmed.filter(k => !changeableKeywords.includes(k))
                setChangeableKeywords([...changeableKeywords, ...unique])
                setKeywords([])
              }}
            >
              <Plus size={16} /> Agregar
            </button>
          </section>

          <section className="flex flex-wrap gap-2">
            {changeableKeywords.map(k => (
              <button
                key={k}
                type="button"
                className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded"
                onClick={() => setChangeableKeywords(changeableKeywords.filter(x => x !== k))}
              >
                {k} <span className="text-red-500">x</span>
              </button>
            ))}
          </section>

          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label htmlFor="file" error={fileError} text="Archivo PDF*" />
            <input
              type="file"
              id="file"
              name="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className={`block w-full md:w-3/4 p-2 border rounded ${fileError ? 'border-red-500' : ''}`}
            />
            {fileError && <span className="text-red-500">Por favor suba un PDF válido.</span>}
          </section>

          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label htmlFor="article" error={false} text="Artículo relacionado (opcional)" />
            <Select
              required
              error={false}
              id="article"
              name="article"
              value={articleId}
              onChange={e => setArticleId(e.target.value)}
              options={[{ label: 'Seleccione un artículo relacionado', value: '', key: 'no_article' }, ...articles.map(a => ({ label: a.title, value: a._id, key: a._id }))]}
            />
          </section>

          <section className="flex justify-end gap-2 mt-4 pb-4">
            <button
              type="button"
              className="btn-outline py-2 px-4 rounded"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="py-2 px-4 rounded text-white bg-blue-600 hover:bg-blue-700">
              {buttonText}
            </button>
          </section>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PracticeReportForm
