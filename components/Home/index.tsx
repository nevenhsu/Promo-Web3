'use client'
import { useState } from 'react'
import { useMantineTheme } from '@mantine/core'
import _ from 'lodash'
import {
  Container,
  Stack,
  Box,
  Group,
  Title,
  Text,
  Button,
  Avatar,
  Card,
  Flex,
  Progress,
} from '@mantine/core'
// icons
import { IoWallet } from 'react-icons/io5'
import { LiaHistorySolid } from 'react-icons/lia'
import BronzeIcon from '@/components/share/icon/BronzeIcon'
import SilverIcon from '@/components/share/icon/SilverIcon'
import GoldIcon from '@/components/share/icon/GoldIcon'
import PlatinumIcon from '@/components/share/icon/PlatinumIcon'

const MAX_POINTS = 1000

enum Level {
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum',
}

const LevelList = [
  {
    level: Level.Bronze,
    points: 0,
    title: 'Bronze',
  },
  {
    level: Level.Silver,
    points: 200,
    title: 'Silver',
  },
  {
    level: Level.Gold,
    points: 600,
    title: 'Gold',
  },
  {
    level: Level.Platinum,
    points: 1000,
    title: 'Platinum',
  },
]

function LevelIcon(props: { level: Level; isCurrentLevel: boolean; reached: boolean }) {
  const { level, isCurrentLevel = false, reached = false } = props

  let color = null
  if (isCurrentLevel) {
    color = '#FFA41B'
  } else if (reached) {
    color = '#FFDBA4'
  } else {
    color = '#CBD5E1'
  }

  switch (level) {
    case Level.Gold:
      return <GoldIcon color={color} />
    case Level.Silver:
      return <SilverIcon color={color} />
    case Level.Platinum:
      return <PlatinumIcon color={color} />
    case Level.Bronze:
    default:
      return <BronzeIcon color={color} />
  }
}

export default function Home() {
  const theme = useMantineTheme()

  const [points, setPoints] = useState(850)

  const renderBalance = () => {
    return (
      <Card mt={12} shadow="sm" padding="md" radius="lg" withBorder>
        <Group justify="space-between">
          {/* avaliable balance */}
          <Flex mih={50} gap="xs" justify="center" align="center" direction="row" wrap="wrap">
            <Avatar variant="filled" radius="md" size="lg" color="#EAF5FF">
              <IoWallet color="#2C98FF" size="2rem" />
            </Avatar>
            <Stack gap={0}>
              <Text fw={700} fz={14}>
                $ 300,000
              </Text>
              <Text fz={12}>Available balance</Text>
            </Stack>
          </Flex>
          {/* action */}
          <Flex mih={50} gap="xs" justify="center" align="center" direction="row" wrap="wrap">
            {/* History */}
            <Stack style={{ cursor: 'pointer' }} align="center" justify="flex-start" gap={0}>
              <Avatar variant="filled" radius="sm" size="md" color="#2C98FF">
                <LiaHistorySolid color="white" size="1.5rem" />
              </Avatar>
              <Text mt={1} fz={12} c="#1F2937">
                History
              </Text>
            </Stack>
          </Flex>
        </Group>
      </Card>
    )
  }

  const renderLevel = () => {
    function checkCurrentLevel(level: Level, index: number): boolean {
      const [levelInfo] = _.filter(LevelList, el => el.level === level)
      const nextLevel = index + 1 > LevelList.length ? null : LevelList[index + 1]

      if (points >= levelInfo?.points) {
        if (_.isEmpty(nextLevel)) {
          return true
        } else if (points <= nextLevel.points) {
          return true
        } else {
          return false
        }
      }
      return false
    }

    return (
      <Card mt={12} shadow="sm" padding="md" radius="xs" withBorder>
        <Group mb={18} justify="space-between">
          <Text mt={1} fz={16} fw={700} c="#1F2937">
            History
          </Text>
          <Button style={{ width: '100px' }} variant="filled" radius="xl" c="#2C98FF" bg="#EAF5FF">
            Detail
          </Button>
        </Group>
        <Group mb={10} justify="space-between">
          {_.map(LevelList, (el, index) => {
            const isCurrentLevel = checkCurrentLevel(el?.level, index) || false
            return (
              <Stack align="center" justify="center" gap={8}>
                <LevelIcon
                  level={el?.level}
                  isCurrentLevel={isCurrentLevel}
                  reached={points > el?.points}
                />
                <Text fz={12} fw={isCurrentLevel ? 700 : 400}>
                  {el?.title}
                </Text>
              </Stack>
            )
          })}
        </Group>
        <Progress color="yellow" radius="xl" value={_.round((points * 100) / MAX_POINTS, 0)} />
        <Text mt={10} fz={12} fw={400} c="#1F2937">
          Gain more {MAX_POINTS.toLocaleString()} and wait until <b>31 Dec 2023</b> to reach
          platinum
        </Text>
      </Card>
    )
  }

  return (
    <Container px={0} style={{ position: 'relative' }} size="xs">
      {/* top bg */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '165px',
        }}
        bg="#339AF0"
      ></Box>
      {/* content */}
      <Stack
        px={24}
        pt={36}
        style={{ position: 'absolute', top: 0 }}
        align="stretch"
        justify="flex-start"
      >
        {/* user profile */}
        <Group justify="space-between">
          {/* username */}
          <Stack gap={0}>
            <Text fw={500} fz={{ base: 12, md: 12 }} c="white">
              Good Morning
            </Text>
            <Text fw={700} fz={{ base: 24, md: 24 }} c="white">
              Alycia
            </Text>
          </Stack>
          {/* avatar */}
          <Avatar variant="filled" radius="xl" size="lg" src="" />
        </Group>
        {/* balance */}
        {renderBalance()}

        {/* level */}
        {renderLevel()}

        <Text>
          A new payment way to make triple wins for business based on the unique referral system.
        </Text>
        <Box>
          <Button>Get Started</Button>
        </Box>
      </Stack>
    </Container>
  )
}
