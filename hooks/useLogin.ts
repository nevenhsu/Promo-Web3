'use client'

import { useLogin as _useLogin, useLinkAccount } from '@privy-io/react-auth'
import { usePrivy } from '@privy-io/react-auth'
import { usePrivySmartAccount } from '@zerodev/privy'
import type { User, CallbackError } from '@privy-io/react-auth'

type CallbackComplete = (user: User, isNewUser: boolean, wasAlreadyAuthenticated: boolean) => void

type LoginValue = {
  onComplete?: CallbackComplete
  onError?: CallbackError
}

export default function useLogin(val?: LoginValue) {
  const { onComplete, onError } = val || {}
  const { ready, authenticated } = usePrivy()

  const { login } = _useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
      // TODO: switch network
      if (onComplete) {
        onComplete(user, isNewUser, wasAlreadyAuthenticated)
      }
    },
    onError: err => {
      if (onError) {
        onError(err)
      }
    },
  })

  return { login, authenticated }
}
