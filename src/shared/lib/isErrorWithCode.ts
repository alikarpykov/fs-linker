type ErrorWithCode = Error & {
  code: string
}

export const isErrorWithCode = (
  error: unknown,
  code: string,
): error is ErrorWithCode => {
  return error instanceof Error && 'code' in error && error.code === code
}
