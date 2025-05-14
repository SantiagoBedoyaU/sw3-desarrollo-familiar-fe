export default interface EducationalMaterial {
  _id: string
  title: string
  type: EducationalMaterialType
  description?: string
  minAge?: number
  maxAge?: number
  fileAddress: string
  file?: File
}

export interface EducationalMaterialCreate {
  title: string
  type: EducationalMaterialType
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

export enum EducationalMaterialType {
  Document = 'DOCUMENT',
  Image = 'IMAGE',
  Resource = 'RESOURCE',
  Other = 'Other',
}

export const materialTypes = [
  { value: EducationalMaterialType.Document, label: 'Documento' },
  { value: EducationalMaterialType.Image, label: 'Imagen' },
  { value: EducationalMaterialType.Resource, label: 'Recurso Web' },
  { value: EducationalMaterialType.Other, label: 'Otro' },
]
