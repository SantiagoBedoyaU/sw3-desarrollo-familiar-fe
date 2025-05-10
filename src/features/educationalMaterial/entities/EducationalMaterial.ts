export default interface EducationalMaterial {
  _id: string
  title: string
  type: 'DOCUMENT' | 'IMAGE' | 'RESOURCE' | 'Other'
  description?: string
  minAge?: number
  maxAge?: number
  fileAddress: string
  file?: File
}

export interface EducationalMaterialCreate {
  title: string
  type: 'DOCUMENT' | 'IMAGE' | 'RESOURCE' | 'Other'
  description?: string
  minAge?: number
  maxAge?: number
  file?: File
  fileAddress?: string
}

export interface EducationalMaterialUpdate {
  _id: string
  title: string
  description?: string
  minAge?: number
  maxAge?: number
}

export const materialTypes = [
  { value: 'DOCUMENT', label: 'Documento' },
  { value: 'IMAGE', label: 'Imagen' },
  { value: 'RESOURCE', label: 'Recurso Web' },
  { value: 'Other', label: 'Otro' },
]
