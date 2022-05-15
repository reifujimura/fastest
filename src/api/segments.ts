export const apiUrl = (path: string): string =>
  `${
    process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'
  }${path}`

export const exec = (images: Blob[]): Promise<Segment[][]> => {
  const formData = new FormData()
  images.forEach((image) => formData.append('files', image))
  return fetch(apiUrl('/api/v1/segments'), {
    mode: 'cors',
    method: 'post',
    body: formData,
  })
    .then((res) => res.json())
    .then((json) => json as Segment[][])
}

export const getImages = (): Promise<Blob[]> => {
  const input = document.createElement('input')
  return new Promise<Blob[]>((resolve, reject) => {
    input.accept = 'image/*'
    input.type = 'file'
    input.multiple = true
    const focusBack = () => {
      if (!input.files || input.files.length == 0) reject()
      window.removeEventListener('focus', focusBack)
    }
    input.onchange = () => {
      window.removeEventListener('focus', focusBack)
      const files = input.files
      if (files && files.length > 0) {
        resolve(Array.from({ length: files.length }).map((_, i) => files[i]))
      } else reject()
    }
    window.addEventListener('focus', focusBack)
    input.click()
  }).finally(() => input.parentElement?.removeChild(input))
}
