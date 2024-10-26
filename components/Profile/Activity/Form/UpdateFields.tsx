'use client'

import * as _ from 'lodash-es'
import { useEffect, useState } from 'react'
import { Paper, Box, Stack, Group, Center, Avatar } from '@mantine/core'
import { TextInput, Text, ThemeIcon, NumberInput, Textarea } from '@mantine/core'
import Token from '../Token'
import { useFormContext } from './Context'
import { PiNumberOneBold, PiNumberTwoBold } from 'react-icons/pi'
import type { TActivity } from '@/models/activity'

export default function FormFields({ activity }: { activity: TActivity }) {
  const { airdrop } = activity

  const form = useFormContext()
  const { details } = form.values
  const { externalLink } = details

  const [prize, setPrize] = useState<string>('1')

  useEffect(() => {
    const trimmed = _.trim(externalLink)
    if (trimmed !== externalLink) {
      form.setFieldValue('details.externalLink', trimmed)
    }
  }, [externalLink])

  return (
    <>
      <Paper p="md" radius="md">
        <Stack gap="sm">
          <Group gap="xs">
            <ThemeIcon size="xs" color="dark" mb={4}>
              <PiNumberOneBold />
            </ThemeIcon>
            <Text fw={500}>What is the activity about?</Text>
          </Group>

          <TextInput
            label="Title"
            placeholder="Activity title"
            key={form.key('title')}
            {...form.getInputProps('title')}
          />

          <Textarea
            label="Description"
            placeholder="Activity description"
            key={form.key('description')}
            {...form.getInputProps('description')}
          />

          <TextInput
            label="Website link"
            placeholder="Your website: https://example.com"
            key={form.key('details.externalLink')}
            {...form.getInputProps('details.externalLink')}
          />
        </Stack>
      </Paper>

      <Paper p="md" radius="md">
        <Stack gap="sm">
          <Group gap="xs">
            <ThemeIcon size="xs" color="dark" mb={4}>
              <PiNumberTwoBold />
            </ThemeIcon>
            <Text fw={500}>How much prize per 100 followers?</Text>
          </Group>

          <Text fz="xs" c="dimmed" pl={24} mt={-8}>
            Each supporter will receive a prize based on the number of their followers up to 10,000
          </Text>

          <Box py="xs">
            <Token
              symbol="USDC"
              name="USD Coin"
              icon="/icons/usdc-token.svg"
              amount="10000"
              paperProps={{
                shadow: 'none',
                bd: '1px solid var(--mantine-color-gray-4)',
              }}
            />
          </Box>

          <Stack gap={4}>
            <Box>
              <Text fz="sm" fw={500}>
                Prize per 100 followers
              </Text>
            </Box>

            <Group
              justify="space-between"
              gap="xs"
              wrap="nowrap"
              style={{
                alignItems: 'stretch',
              }}
            >
              <TextInput
                w="100%"
                leftSection={<Avatar size={24} src="/icons/usdc-token.svg" />}
                value={prize}
                onChange={e => setPrize(e.currentTarget.value)}
                error={form.errors['setting.data.maxTotalScore']}
                styles={{
                  input: {
                    textAlign: 'right',
                  },
                }}
              />

              <Center
                style={{
                  width: '100%',
                  border: '1px solid var(--mantine-color-gray-4)',
                  borderRadius: 'var(--mantine-radius-default)',
                }}
              >
                <Text ta="center">100 Followers</Text>
              </Center>
            </Group>
          </Stack>

          <NumberInput
            label="Minimum followers"
            description="Everyone should meet the requirement to earn"
            key={form.key('setting.data.minFollowers')}
            {...form.getInputProps('setting.data.minFollowers')}
          />
        </Stack>
      </Paper>
    </>
  )
}

function calcMaxTotalScore(amount: string, prize: string) {
  const defaultMax = Number(amount) * 100
  const max = defaultMax / Number(prize)
  return _.isNaN(max) ? 0 : max
}
