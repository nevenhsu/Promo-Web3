'use client'

import * as _ from 'lodash-es'
import React, { useState, useEffect } from 'react'
import { isBefore } from 'date-fns'
import { useWeb3 } from '@/wallet/Web3Context'
import { FormProvider, useForm } from './Context'
import { formatZonedDate } from '@/utils/helper'
import { isValidXPostLink } from '@/utils/socialMedia'
import { getXPostId } from '@/utils/socialMedia'
import { formatAmount } from '@/utils/math'
import { ActivityType, SocialMedia, ActivitySettingType } from '@/types/db'

export type FormType = ReturnType<typeof useForm>

export type FormRef = {
  getForm: () => FormType
}

type FormProps = {
  onReady: (form: FormType) => void
  children: React.ReactNode
}

function MyForm({ onReady, children }: FormProps) {
  const { balancesValues, tokenListValues } = useWeb3()

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
          minFollowers: 1,
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
        if (isBefore(value, new Date())) {
          return 'Should be in the future'
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
        amount: (value, values) => {
          const token = tokenListValues.userTokens.find(o => o.symbol === values.airdrop.symbol)

          if (!token) {
            return 'Token not found'
          }

          if (Number(value) > 0) {
            const amount = formatAmount(value, token.decimals)
            const bal = balancesValues.balances[token.symbol]

            if (!bal || amount.gt(bal.balance.toString())) {
              return 'Insufficient balance'
            }

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
          minFollowers: value => (value > 0 ? null : 'Should be greater than 0'),
          maxTotalScore: value => (value > 0 ? null : 'Should be greater than 0'),
        },
      },
    },
  })

  useEffect(() => {
    onReady(form)
  }, [])

  return <FormProvider form={form}>{children}</FormProvider>
}

// WrapForm is used to reset the form when balances or token list changes
export default function WrapForm(props: FormProps) {
  const [formKey, setFormKey] = useState(0)
  const { balancesValues, tokenListValues } = useWeb3()

  useEffect(() => {
    setFormKey(prevKey => prevKey + 1)
  }, [balancesValues, tokenListValues])

  return <MyForm key={formKey} {...props} />
}

function checkURL(url: string) {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
