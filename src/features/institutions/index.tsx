import { useEffect, useState } from 'react'
import { useInstitutionStore } from './stores/InstitutionsStore'
import InstitutionForm from './components/InstitutionForm'
import InstitutionsList from './components/InstitutionsList'
import Input from '../../shared/components/common/Input'

const Institutions = () => {
  const { fetchInstitutions, institutions } = useInstitutionStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchInstitutions()
  }, [fetchInstitutions])

  const filtered = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 bg-white shadow rounded-lg mt-4">
      {/* Título */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Instituciones educativas
      </h2>

      {/* Formulario para agregar institución */}
      <InstitutionForm />

      {/* Input de búsqueda */}
      <section className="my-6">
        <label
          htmlFor="search"
          className="text-sm font-medium text-gray-700 block mb-1"
        >
          Buscar institución
        </label>
        <Input
          id="search"
          name="search"
          type="text"
          placeholder="Buscar institución por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          required={false}
          error={false}
          className="w-full"
        />
      </section>

      {/* Lista de instituciones */}
      <InstitutionsList institutions={filtered} />
    </section>
  )
}

export default Institutions
