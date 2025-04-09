function DialogFooter() {
  return (
    <section className="flex justify-end gap-2 p-4">
      <button
        type="button"
        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        Cancelar
      </button>
      <button
        type="button"
        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Aceptar
      </button>
    </section>
  )
}

export default DialogFooter
