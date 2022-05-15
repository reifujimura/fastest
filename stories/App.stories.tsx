import React from 'react'
import { App } from '../src/containers/App'
import { AppProvider } from '../src/store'

export default {
  title: 'containers/App',
}

export const Default = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  )
}
