'use client'
import { useState } from 'react'
import { useMantineTheme } from '@mantine/core'
import { useRouter } from 'next/navigation'
import * as _ from 'lodash-es'
import { notifications } from '@mantine/notifications'
// components
import {
  Container,
  Stack,
  Group,
  Text,
  Button,
  UnstyledButton,
  Avatar,
  ActionIcon,
  Input,
} from '@mantine/core'
// icons
import { PiArrowLeft } from 'react-icons/pi'
import { IoStar, IoStarOutline, IoCopyOutline } from 'react-icons/io5'

// assets

enum State {
  EnterReferralCode = 'EnterReferralCode',
  ReferYourFriends = 'ReferYourFriends',
}

export default function Referral() {
  const router = useRouter()
  const theme = useMantineTheme()

  const [state, setState] = useState(State.EnterReferralCode)
  const [shareUrl, setShareUrl] = useState('https://website/?referral=sjioe345')

  const handleSubmit = () => {
    setState(State.ReferYourFriends)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl)
    notifications.show({
      title: 'Copied',
      radius: 'xs',
    })
  }

  return (
    <Container size="xs">
      <Group mt="40px" mb="40px" justify="space-between">
        <ActionIcon variant="default" radius="xl" onClick={() => setState(State.EnterReferralCode)}>
          <PiArrowLeft color="black" />
        </ActionIcon>
        {state !== State.ReferYourFriends && (
          <UnstyledButton onClick={() => setState(State.ReferYourFriends)}>
            <Text fz={14} fw={600} c="#868E96">
              Skip
            </Text>
          </UnstyledButton>
        )}
      </Group>
      <Stack align="flex-start" justify="flex-start" gap={0}>
        <Avatar size="md" bg={'#FFA41B'}>
          <IoStar size="1.5rem" color="white" />
        </Avatar>
        <Text my="16px" fz={34} fw={700}>
          {state === State.EnterReferralCode ? 'Enter referral code' : 'Refer your friends'}
        </Text>
        <Text mb="40px" fz={18} fw={400}>
          {state === State.EnterReferralCode
            ? 'Get extra 100 points for you and your friend.'
            : 'Get extra 100 points for you and your friend.'}
        </Text>

        {state === State.EnterReferralCode ? (
          <Input
            style={{ width: '100%' }}
            size="md"
            radius="xs"
            placeholder="Enter referral code"
            leftSection={<IoStarOutline />}
          />
        ) : (
          <Input
            style={{ width: '100%' }}
            size="md"
            radius="xs"
            value={shareUrl}
            placeholder="Enter referral code"
            leftSection={<IoStarOutline />}
            rightSection={<IoCopyOutline />}
          />
        )}

        {state === State.EnterReferralCode ? (
          <Button size="md" mt="40px" fullWidth radius="xs" onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <Button size="md" mt="40px" fullWidth radius="xs" onClick={handleShare}>
            Share
          </Button>
        )}
      </Stack>
    </Container>
  )
}
