export function getErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado.'): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: string }).message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }
  return fallback;
}
