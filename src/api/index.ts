export const apiUrl = (path: string): string =>
  `${
    process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'
  }${path}`
