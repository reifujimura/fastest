import React from 'react'
import { Story } from '@storybook/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const theme = createTheme({})

export const decorators = [
  (Story: Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
]
