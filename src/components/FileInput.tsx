import React, { useRef } from 'react'
import { Button } from '@mui/material'

type FileInputProps = {
  title?: string
  onChange?: (files: Blob[]) => void
}

export const FileInput = ({ title, onChange }: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <input
        style={{ display: 'none' }}
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = e.target.files
          if (files) {
            onChange?.(
              Array.from({ length: files.length }).map((_, i) => files[i])
            )
          }
        }}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={() => inputRef.current?.click()}
      >
        {title}
      </Button>
    </>
  )
}
