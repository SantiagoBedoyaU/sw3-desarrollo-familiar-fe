export default interface EducationalMaterial {
  _id: string
  title: string
  type: 'document' | 'image' | 'resource' | 'other'
  description?: string
  minAge?: number
  maxAge?: number
  url: string
  file?: File
}

export interface EducationalMaterialCreate {
  title: string
  type: 'document' | 'image' | 'resource' | 'other'
  description?: string
  minAge?: number
  maxAge?: number
  file?: File
  url?: string
}

export interface EducationalMaterialUpdate {
  _id: string
  title: string
  description?: string
  minAge?: number
  maxAge?: number
}

export const materialTypes = [
  { value: 'document', label: 'Documento' },
  { value: 'image', label: 'Imagen' },
  { value: 'resource', label: 'Recurso Web' },
  { value: 'other', label: 'Otro' },
]
