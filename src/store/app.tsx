import React, { createContext, useContext, useReducer } from 'react'
import { exec } from '../api/segments'

type State = {
  loading: boolean
  results?: (Result & { index?: number })[]
}

const defaultState: State = {
  loading: false,
}

type StartAction = {
  type: 'start'
}

type SetResultsAction = {
  type: 'set-results'
  results: Result[]
}

type SetIndexAction = {
  type: 'set-index'
  resultIndex: number
  segmentIndex?: number
}

type ClearAction = {
  type: 'clear'
}

type Action = StartAction | SetResultsAction | SetIndexAction | ClearAction

const Context = createContext<
  State & {
    start: (files: Blob[]) => void
    end: () => void
    select: (resultIndex: number, segmentIndex?: number) => void
  }
>({
  ...defaultState,
  start: () => {
    throw Error('Not implemented')
  },
  end: () => {
    throw Error('Not implemented')
  },
  select: () => {
    throw Error('Not implemented')
  },
})

type Environment = {
  exec: (images: Blob[]) => Promise<Segment[][]>
}

const convertBlobToImage = (data: Blob): Promise<Image> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    const url = URL.createObjectURL(data)
    img.onload = () => {
      const name = (data as File)?.name ?? ''
      const { width, height } = img
      img.parentElement?.removeChild(img)
      resolve({
        name,
        url,
        width,
        height,
      })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      img.parentElement?.removeChild(img)
      reject()
    }
    img.src = url
  })
}

export const defaultEnvitonment: Environment = {
  exec,
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        loading: true,
      }
    case 'set-results':
      return {
        ...state,
        results: action.results,
        loading: false,
      }
    case 'set-index':
      return {
        ...state,
        results: state.results?.map((x, i) =>
          i === action.resultIndex ? { ...x, index: action.segmentIndex } : x
        ),
      }
    case 'clear':
      return { ...state, results: undefined, loading: false }

    default:
      return state
  }
}

type AppProviderProps = React.PropsWithChildren<{
  initialState?: State
  environment?: Environment
}>

export const AppProvider = ({
  initialState,
  environment,
  children,
}: AppProviderProps) => {
  const [state, dispatch] = useReducer<(state: State, action: Action) => State>(
    (state, action) => reducer(state, action),
    initialState ?? defaultState
  )
  const env = environment ?? defaultEnvitonment
  const start = (files: Blob[]) => {
    dispatch({ type: 'start' })
    Promise.all([
      Promise.all(files.map((files) => convertBlobToImage(files))),
      env.exec(files),
    ])
      .then(([images, results]) =>
        images.map<Result>((image, i) => ({
          image,
          segments: results[i],
        }))
      )
      .then((results) => dispatch({ type: 'set-results', results }))
      .catch(() => dispatch({ type: 'clear' }))
  }
  const select = (resultIndex: number, segmentIndex?: number) =>
    dispatch({ type: 'set-index', resultIndex, segmentIndex })
  const end = () => {
    state.results?.forEach(({ image }) => URL.revokeObjectURL(image.url))
    dispatch({ type: 'clear' })
  }
  const value = {
    ...state,
    start,
    select,
    end,
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useApp = () => useContext(Context)
