import EducationalMaterial from '../entities/EducationalMaterial'
import { educationalMaterialService } from '../services/EducationalMaterialService'

/**
 * Función para descargar o abrir un material educativo.
 * Si es un recurso web, abre el enlace en una nueva pestaña.
 * Si es un archivo, lo descarga.
 *
 * @param material El material educativo a descargar o abrir
 * @returns Una promesa que se resuelve cuando la operación se completa
 */
const downloadMaterial = async (
  material: EducationalMaterial,
): Promise<void> => {
  try {
    await educationalMaterialService.downloadMaterial(material)
  } catch (error) {
    console.error('Error downloading material:', error)
    throw error
  }
}

export default downloadMaterial
