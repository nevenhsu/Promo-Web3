'use client'

import { AppProvider, type AppProviderProps } from '@/store/AppContext'
import { ContractProvider } from '@/store/contexts/ContractContext'

export default function ContextProvider({ isPreview, children }: AppProviderProps) {
  return (
    <AppProvider isPreview={isPreview}>
      <ContractProvider>{children}</ContractProvider>
    </AppProvider>
  )
}
