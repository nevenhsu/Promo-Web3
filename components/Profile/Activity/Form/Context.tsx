'use client'

import { createFormContext } from '@mantine/form'

// Definition of form values is required
export interface FormValues {
  title: string
  slug: string
  startTime: null | Date
  endTime: null | Date
  description: string
  activityType: string
  socialMedia: string
  airdrop: {
    _userToken?: string
    symbol: string
    amount: string // Base unit, not wei, ex: 10 USDC
  }
  details: {
    link: string
    fullLink: string
    externalLink: string
    coverUrl?: string | null
    thumbnailUrl?: string | null
  }
  setting: {
    type: string
    data: {
      maxTotalScore: number
      maxSelfScore: number
      minFollowers: number
    }
  }
  published: boolean
}

export type ActivityData = Omit<FormValues, 'activityType'> & {
  activityType: number
  chainId: number
  startTime: Date
  endTime: Date
}

// createFormContext returns a tuple with 3 items:
// FormProvider is a component that sets form context
// useFormContext hook return form object that was previously set in FormProvider
// useForm hook works the same way as useForm exported from the package but has predefined type
export const [FormProvider, useFormContext, useForm] = createFormContext<FormValues>()
