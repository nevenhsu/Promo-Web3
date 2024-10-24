'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import type { BreakPoint } from '@/types/common'

type AppState = {
  isPreview: boolean
  isMobileDevice: boolean
  breakPoints: BreakPoint[]
  viewportSize: { width: number; height: number }
  pages: string[] // track the pages visited
}

type AppValue = {
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
  updateState: (next: Partial<AppState>) => void
}

const initialState: AppState = {
  isPreview: false,
  isMobileDevice: false,
  breakPoints: ['base'], // ['base', 'xs', 'sm', 'md', 'lg', 'xl']
  viewportSize: { width: 0, height: 0 },
  pages: [],
}

// Create the context
const AppContext = createContext<AppValue | undefined>(undefined)

// Create a provider component
type AppProviderProps = {
  isPreview: boolean
  isMobileDevice: boolean
  children: React.ReactNode
}

export const AppProvider = ({ isPreview, isMobileDevice, children }: AppProviderProps) => {
  const [state, setState] = useState<AppState>({ ...initialState, isPreview, isMobileDevice })

  const updateState = (next: Partial<AppState>) => {
    setState(prev => {
      // console.log('updateState', next)
      return { ...prev, ...next }
    })
  }

  useEffect(() => {
    updateState({ isPreview })
  }, [isPreview])

  useEffect(() => {
    updateState({ isMobileDevice })
  }, [isMobileDevice])

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        updateState,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Export the context
export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }

  return context
}
