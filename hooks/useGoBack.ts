'use client'

import { useRouter } from '@/i18n/routing'
import { useEffect } from 'react'
import { usePathname } from '@/i18n/routing'
import { useAppContext } from '@/store/AppContext'

export function useGoBack() {
  const router = useRouter()

  const {
    state: { pages },
    setState,
  } = useAppContext()
  const pathname = usePathname()
  const canGoBack = pages.length > 1

  const goBack = () => {
    if (!canGoBack) return

    setState(prev => ({ ...prev, pages: prev.pages.slice(0, -1) }))

    router.back()
  }

  useEffect(() => {
    // Add the current page to the pages array
    setState(prev => {
      const prevLast = prev.pages[prev.pages.length - 1]
      if (prevLast !== pathname) {
        return { ...prev, pages: [...prev.pages, pathname] }
      }
      return prev
    })
  }, [pathname])

  return { canGoBack, goBack }
}
