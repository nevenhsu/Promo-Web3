'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import type { BreakPoint } from '@/types/common'

type AppState = {
  isPreview: boolean
  breakPoints: BreakPoint[]
  viewportSize: { width: number; height: number }
}

type AppValue = {
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
  updateState: (next: Partial<AppState>) => void
}

const initialState: AppState = {
  isPreview: false,
  breakPoints: ['base'], // ['base', 'xs', 'sm', 'md', 'lg', 'xl']
  viewportSize: { width: 0, height: 0 },
}

const initValue: AppValue = {
  state: initialState,
  setState: () => {},
  updateState: () => {},
}

// Create the context
const AppContext = createContext(initValue)

// Create a provider component
type AppProviderProps = { isPreview: boolean; children: React.ReactNode }

export const AppProvider = ({ isPreview, children }: AppProviderProps) => {
  const [state, setState] = useState({ ...initialState, isPreview })

  const updateState = (next: Partial<AppState>) =>
    setState(prev => {
      // console.log('updateState', next)
      return { ...prev, ...next }
    })

  // Define any functions or values you want to provide
  const value: AppValue = {
    state,
    setState,
    updateState,
  }

  useEffect(() => {
    updateState({ isPreview })
  }, [isPreview])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Export the context
export const useAppContext = () => useContext(AppContext)
