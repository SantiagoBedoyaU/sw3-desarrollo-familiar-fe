export interface ResponseEntity<T> {
  data: T[]
  totalItems: number
  totalPages: number
  currentPage: number
}
