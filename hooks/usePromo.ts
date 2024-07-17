import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocalStorage } from 'react-use'

export function usePromo() {
  // Get promo code from query params
  const searchParams = useSearchParams()
  const promo = searchParams.get('promo') || ''
  const [_promo, setPromo] = useLocalStorage<string>('promo', promo)

  useEffect(() => {
    if (promo && promo !== _promo) {
      setPromo(promo)
    }
  }, [promo, _promo])

  return _promo
}
