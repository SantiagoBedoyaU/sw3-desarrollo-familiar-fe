import { useState } from 'react'
import { useInstitutionStore } from '../stores/InstitutionsStore'
import Input from '../../../shared/components/common/Input'
import Button from '../../../shared/components/common/Button'

const InstitutionForm = () => {
  const [name, setName] = useState('')
  const { addInstitution } = useInstitutionStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    await addInstitution({ name })
    setName('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full md:w-auto"
    >
      <label className="text-sm font-medium text-gray-700">
        Agregar institución
      </label>
      <div className="flex flex-wrap gap-2 items-end">
        <Input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Nombre de la institución"
          error={false}
          className="w-64"
        />
        <Button type="submit" className="w-fit">
          Agregar
        </Button>
      </div>
    </form>
  )
}

export default InstitutionForm
