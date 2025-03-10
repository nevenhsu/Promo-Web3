'use client'

import * as _ from 'lodash-es'
import { useMemo, useEffect } from 'react'
import { isBefore } from 'date-fns'
import { Paper, TextInput, Select, Stack, Group, Text, ThemeIcon } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useWeb3 } from '@/wallet/Web3Context'
import { useFormContext } from './Context'
// import { useTokenList } from '@/hooks/useTokenList'
import { getXPostId, getInstagramPostId } from '@/utils/socialMedia'
import { formatBalance, formatFixedNumber } from '@/utils/math'
import { PiNumberOneBold, PiNumberTwoBold, PiNumberThreeBold } from 'react-icons/pi'
import { ActivityType, SocialMedia } from '@/types/db'

export default function FormFields() {
  // const { userTokens } = useTokenList()
  const { balancesValues, tokenListValues } = useWeb3()
  const { balances } = balancesValues
  const { userTokens } = tokenListValues

  console.log({ balances })

  const form = useFormContext()
  const { socialMedia, activityType, details, airdrop } = form.values
  const { symbol, amount } = airdrop
  const { fullLink } = details

  const tokenBal = balances[symbol]

  // Activity types based on social media
  const activityTypes = useMemo(() => {
    if (socialMedia === SocialMedia.X) {
      return [{ label: 'Repost', value: `${ActivityType.Repost}` }]
    }
    if (socialMedia === SocialMedia.Instagram) {
      return [{ label: 'Add to story', value: `${ActivityType.Story}` }]
    }
    return []
  }, [socialMedia])

  // Set default activity type based on social media
  useEffect(() => {
    if (socialMedia === SocialMedia.X && activityType !== `${ActivityType.Repost}`) {
      form.setFieldValue('activityType', `${ActivityType.Repost}`)
    }
    if (socialMedia === SocialMedia.Instagram && activityType !== `${ActivityType.Story}`) {
      form.setFieldValue('activityType', `${ActivityType.Story}`)
    }
  }, [socialMedia, activityType])

  // Set default setting data based on setting type
  useEffect(() => {
    const amountNum = Number(amount) || 0

    form.setFieldValue('setting.data', {
      maxTotalScore: amountNum * 1000,
      maxSelfScore: 10000,
      minFollowers: 100,
    })
  }, [amount])

  // Extract post id from full link
  useEffect(() => {
    const trimmed = _.trim(fullLink)
    if (trimmed !== fullLink) {
      form.setFieldValue('details.fullLink', trimmed)
    }
    if (socialMedia === SocialMedia.X) {
      const postId = getXPostId(trimmed)
      form.setFieldValue('details.link', postId)
    }
    if (socialMedia === SocialMedia.Instagram) {
      const postId = getInstagramPostId(trimmed)
      form.setFieldValue('details.link', postId)
    }
  }, [socialMedia, fullLink])

  // Reset symbol if not found in the list
  useEffect(() => {
    if (airdrop.symbol && !userTokens.find(o => o.symbol === symbol)) {
      form.setFieldValue('airdrop.symbol', '')
    }
  }, [airdrop.symbol, userTokens])

  return (
    <>
      <Paper p="md" radius="md">
        <Stack gap="sm">
          <Group gap="xs">
            <ThemeIcon size="xs" color="dark" mb={4}>
              <PiNumberOneBold />
            </ThemeIcon>
            <Text fw={500}>What is the date of this activity?</Text>
          </Group>
          <DateTimePicker
            valueFormat="DD MMM YYYY hh:mm A"
            label="Start Time"
            key={form.key('startTime')}
            {...form.getInputProps('startTime')}
          />

          <DateTimePicker
            valueFormat="DD MMM YYYY hh:mm A"
            label="End Time"
            key={form.key('endTime')}
            {...form.getInputProps('endTime')}
            excludeDate={date =>
              isBefore(date, new Date()) ||
              Boolean(form.getValues().startTime && isBefore(date, form.getValues().startTime!))
            }
          />
        </Stack>
      </Paper>

      <Paper p="md" radius="md">
        <Stack gap="sm">
          <Group gap="xs">
            <ThemeIcon size="xs" color="dark" mb={4}>
              <PiNumberTwoBold />
            </ThemeIcon>
            <Text fw={500}>What is the post to be shared?</Text>
          </Group>
          <Select
            label="Social Media"
            placeholder="Pick one"
            withCheckIcon={false}
            allowDeselect={false}
            data={_.map(SocialMedia, (value, label) => ({ value, label }))}
            key={form.key('socialMedia')}
            {...form.getInputProps('socialMedia')}
          />

          <Select
            placeholder="Pick one"
            withCheckIcon={false}
            allowDeselect={false}
            data={activityTypes.map(({ value, label }) => ({ value, label }))}
            key={form.key('activityType')}
            {...form.getInputProps('activityType')}
          />

          <TextInput
            label="Post Link"
            placeholder={
              socialMedia === SocialMedia.X
                ? 'https://x.com/user/status/post_id'
                : socialMedia === SocialMedia.Instagram
                  ? 'https://www.instagram.com/p/post_id'
                  : ''
            }
            key={form.key('details.fullLink')}
            {...form.getInputProps('details.fullLink')}
          />
        </Stack>
      </Paper>

      <Paper p="md" radius="md">
        <Stack gap="sm">
          <Group gap="xs">
            <ThemeIcon size="xs" color="dark" mb={4}>
              <PiNumberThreeBold />
            </ThemeIcon>
            <Text fw={500}>How much is the prize for supporters?</Text>
          </Group>
          <Select
            label="Token"
            placeholder="Pick one"
            withCheckIcon={false}
            data={userTokens.map(o => ({ value: o.symbol, label: `${o.name} (${o.symbol})` }))}
            key={form.key('airdrop.symbol')}
            {...form.getInputProps('airdrop.symbol')}
          />

          <TextInput
            label="Prize"
            key={form.key('airdrop.amount')}
            description={`Balance available: ${formatFixedNumber(formatBalance(tokenBal?.balance?.toString() || 0, tokenBal?.decimals || 0), tokenBal?.decimals || 0)}`}
            {...form.getInputProps('airdrop.amount')}
          />
        </Stack>
      </Paper>
    </>
  )
}
