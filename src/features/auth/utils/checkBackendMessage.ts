export const checkBackendMessage = (err: unknown): string | null => {
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof err.response === 'object' &&
    err.response !== null &&
    'data' in err.response &&
    typeof err.response.data === 'object' &&
    err.response.data !== null &&
    'message' in err.response.data
  ) {
    const msg = err.response.data.message
    return typeof msg === 'string' ? msg : JSON.stringify(msg)
  }
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const msg = err.message
    return typeof msg === 'string' ? msg : JSON.stringify(msg)
  }
  if (typeof err === 'string') {
    return err
  }
  return null
}
