'use client'

import * as _ from 'lodash-es'
import React from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import { isBefore } from 'date-fns'
import { FormProvider, useForm } from './Context'
import { formatZonedDate } from '@/utils/helper'
import { ActivityType, SocialMedia, ActivitySettingType } from '@/types/db'
import { defaultChain } from '@/wallet/variables'

export type FormRef = {
  getForm: () => ReturnType<typeof useForm>
}

type FormProps = {
  children: React.ReactNode
}

export default forwardRef<FormRef, FormProps>(function Form({ children }, ref) {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      chainId: `${defaultChain.id}`,
      title: '',
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
        coverUrl: '',
        thumbnailUrl: '',
        externalLink: '',
      },
      setting: {
        type: ActivitySettingType.None,
        data: {},
      },
      published: false,
    },
    validate: {
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
      title: value => (value ? null : 'Should not be empty'),
      slug: value => (value ? null : 'Should not be empty'),
      activityType: value => (value ? null : 'Should not be empty'),
      socialMedia: value => (value ? null : 'Should not be empty'),
      airdrop: {
        symbol: value => (value ? null : 'Should not be empty'),
        amount: value => (Number(value) >= 0 ? null : 'Should be greater than or equal to 0'),
      },
      details: {
        link: value => (value ? null : 'Should not be empty'),
        fullLink: value => (value ? null : 'Should not be empty'),
      },
      setting: {
        data: value => {
          return Number(value?.minFollowers) <= 0 ? 'Should be greater than 0' : null
        },
      },
    },
  })

  useImperativeHandle(ref, () => ({
    getForm: () => form,
  }))

  return <FormProvider form={form}>{children}</FormProvider>
})
