import Image from 'next/image'
import type { Token } from '@/contracts/tokens'

export function TokenIcon({ token, size }: { token: Token; size: number }) {
  return (
    <Image
      src={token.icon || ''}
      width={size}
      height={size}
      alt={token.symbol || ''}
      style={{
        borderRadius: 1000,
        overflow: 'hidden',
      }}
    />
  )
}
