'use client'

import * as _ from 'lodash-es'
import React from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import { isBefore } from 'date-fns'
import { useWeb3 } from '@/wallet/Web3Context'
import { FormProvider, useForm } from './Context'
import { formatZonedDate } from '@/utils/helper'
import { isValidXPostLink, isValidInstagramPostLink } from '@/utils/socialMedia'
import { getXPostId, getInstagramPostId } from '@/utils/socialMedia'
import { ActivityType, SocialMedia, ActivitySettingType } from '@/types/db'

export type FormRef = {
  getForm: () => ReturnType<typeof useForm>
}

type FormProps = {
  children: React.ReactNode
}

export default forwardRef<FormRef, FormProps>(function Form({ children }, ref) {
  const { balancesValues } = useWeb3()

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      title: 'My activity',
      slug: '',
      startTime: null,
      endTime: null,
      description: '',
      socialMedia: SocialMedia.X,
      activityType: `${ActivityType.Repost}`,
      airdrop: {
        symbol: '',
        amount: '0',
      },
      details: {
        link: '',
        fullLink: '',
        externalLink: '',
        coverUrl: '',
        thumbnailUrl: '',
      },
      setting: {
        type: ActivitySettingType.A,
        data: {
          maxTotalScore: 0,
          maxSelfScore: 10000,
          minFollowers: 100,
        },
      },
      published: false,
    },
    validate: {
      title: value => (value ? null : 'Should not be empty'),
      startTime: (value, values) => {
        if (!value) {
          return 'Should not be empty'
        }
        if (values.endTime && !isBefore(value, values.endTime)) {
          return `Should before ${formatZonedDate(values.endTime, 'MMM dd yyyy h:mm aa')}`
        }
        return null
      },
      endTime: (value, values) => {
        if (!value) {
          return 'Should not be empty'
        }
        if (values.startTime && isBefore(value, values.startTime)) {
          return `Should after ${formatZonedDate(values.startTime, 'MMM dd yyyy h:mm aa')}`
        }
        return null
      },
      activityType: value => (value ? null : 'Should not be empty'),
      socialMedia: value => (value ? null : 'Should not be empty'),
      airdrop: {
        symbol: value => (value ? null : 'Should not be empty'),
        amount: value => {
          if (Number(value) > 0) {
            // TODO: Check balance
            return null
          }
          return 'Should be greater than 0'
        },
      },
      details: {
        link: value => (value ? null : 'Should not be empty'),
        fullLink: (value, values) => {
          const trimmed = _.trim(value)

          if (!trimmed) {
            return 'Should not be empty'
          }

          if (values.socialMedia === SocialMedia.X) {
            if (!isValidXPostLink(trimmed) || !getXPostId(trimmed)) {
              return 'Should be a valid link: https://x.com/username/status/123'
            }
          }

          if (values.socialMedia === SocialMedia.Instagram) {
            if (!isValidInstagramPostLink(trimmed) || !getInstagramPostId(trimmed)) {
              return 'Should be a valid link: https://www.instagram.com/p/123'
            }
          }

          return null
        },
        externalLink: (value, values) => {
          const trimmed = _.trim(value)

          if (trimmed && !checkURL(trimmed)) {
            return 'Should be a valid URL'
          }

          return null
        },
      },
      setting: {
        data: {
          minFollowers: value => (value >= 100 ? null : 'Should be greater than or equal to 100'),
          maxTotalScore: value => (value > 0 ? null : 'Should be greater than 0'),
        },
      },
    },
  })

  useImperativeHandle(ref, () => ({
    getForm: () => form,
  }))

  return <FormProvider form={form}>{children}</FormProvider>
})

function checkURL(url: string) {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
