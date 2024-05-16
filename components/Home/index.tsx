'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useMantineTheme } from '@mantine/core'
import * as _ from 'lodash-es'
// utils
import { Level } from '@/utils/general'
// components
import {
  Container,
  Stack,
  Box,
  Group,
  Text,
  Button,
  Avatar,
  Card,
  Flex,
  Progress,
  Modal,
} from '@mantine/core'
import LevelDetail, { LevelDetailRef } from '@/components/Home/LevelDetail'
// icons
import { IoWallet, IoChevronForward, IoStar } from 'react-icons/io5'
import { LiaHistorySolid } from 'react-icons/lia'
import BronzeIcon from '@/components/share/icon/BronzeIcon'
import SilverIcon from '@/components/share/icon/SilverIcon'
import GoldIcon from '@/components/share/icon/GoldIcon'
import PlatinumIcon from '@/components/share/icon/PlatinumIcon'
// assets
const InviteImg = '/images/home/invite.svg'
const CheckImg = '/images/home/check.svg'

const MAX_POINTS = 1000

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

  const levelDetailRef = useRef<LevelDetailRef>(null)
  const router = useRouter()

  const [points, setPoints] = useState(850)
  const [checkSuccessOpened, setCheckSuccessOpened] = useState(false)

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
              <Text fw={700} fz="sm">
                $ 300,000
              </Text>
              <Text fz="xs">Available balance</Text>
            </Stack>
          </Flex>
          {/* action */}
          <Flex mih={50} gap="xs" justify="center" align="center" direction="row" wrap="wrap">
            {/* History */}
            <Stack style={{ cursor: 'pointer' }} align="center" justify="flex-start" gap={0}>
              <Avatar variant="filled" radius="sm" size="md" color="#2C98FF">
                <LiaHistorySolid color="white" size="1.5rem" />
              </Avatar>
              <Text mt={1} fz="xs" c="#1F2937">
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
          <Text mt={1} fz="md" fw={700} c="#1F2937">
            History
          </Text>
          <Button
            style={{ width: '100px' }}
            variant="filled"
            radius="xl"
            c="#2C98FF"
            bg="#EAF5FF"
            onClick={() => levelDetailRef.current?.open()}
          >
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
                <Text fz="xs" fw={isCurrentLevel ? 700 : 400}>
                  {el?.title}
                </Text>
              </Stack>
            )
          })}
        </Group>
        <Progress color="yellow" radius="xl" value={_.round((points * 100) / MAX_POINTS, 0)} />
        <Text mt={10} fz="xs" fw={400} c="#1F2937">
          Gain more {MAX_POINTS.toLocaleString()} and wait until <b>31 Dec 2023</b> to reach
          platinum
        </Text>
      </Card>
    )
  }

  return (
    <Box pos="relative" pb={100}>
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
      <Stack pos="relative" px={24} pt={36} align="stretch" justify="flex-start">
        {/* user profile */}
        <Group justify="space-between">
          {/* username */}
          <Stack gap={0}>
            <Text fz="sm" c="white">
              Good Morning
            </Text>
            <Text fw={700} fz={26} c="white">
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

        {/* Invite Friends */}
        <Card
          mt={12}
          shadow="sm"
          padding="md"
          radius="xs"
          withBorder
          style={{
            cursor: 'pointer',
            backgroundImage:
              'linear-gradient(75deg, #FFA51D 0.57%, rgba(255, 164, 27, 0.50) 21.11%, rgba(255, 164, 27, 0.00) 85.29%, rgba(255, 164, 27, 0.00) 98.12%)',
          }}
        >
          <Group justify="space-between">
            <Flex gap="xs" justify="center" align="center" direction="row" wrap="wrap">
              <Avatar src={InviteImg} alt="invite" size="md" bg="white" />
              <Text ml={8} fw={700} fz="sm" c="#1E293B">
                Invite Friends
              </Text>
            </Flex>
            <IoChevronForward size="1.5rem" color="#2C98FF" />
          </Group>
        </Card>

        <Card mt={12} shadow="sm" padding="md" radius="xs" withBorder>
          <Group justify="space-between">
            <Flex gap="xs" justify="center" align="center" direction="row" wrap="wrap">
              <Avatar size="md" bg="#2C98FF">
                <IoStar size="1.5rem" color="white" />
              </Avatar>
              <Text ml={8} fw={700} fz="sm" c="#1E293B">
                Gain 100 points
              </Text>
            </Flex>
            <Button
              variant="outline"
              radius="xl"
              c="#2C98FF"
              onClick={() => setCheckSuccessOpened(true)}
            >
              <Text fw={700} fz="xs">
                Daily Check
              </Text>
            </Button>
          </Group>
        </Card>

        {/* Enter referral code */}
        <Card
          style={{ cursor: 'pointer' }}
          mt={12}
          shadow="sm"
          padding="md"
          radius="xs"
          withBorder
          onClick={() => router.push('/home/referral')}
        >
          <Group justify="space-between">
            <Flex gap="xs" justify="center" align="center" direction="row" wrap="wrap">
              <Avatar size="md" bg="#FFA41B">
                <IoStar size="1.5rem" color="white" />
              </Avatar>
              <Text ml={8} fw={700} fz="sm" c="#1E293B">
                Enter referral code
              </Text>
            </Flex>
            <IoChevronForward size="1.5rem" color="#2C98FF" />
          </Group>
        </Card>
      </Stack>

      <LevelDetail ref={levelDetailRef} />

      {/* daily check modal */}
      <Modal
        opened={checkSuccessOpened}
        onClose={() => setCheckSuccessOpened(false)}
        withCloseButton={false}
        size="sm"
      >
        <Stack mt="50px" mb="50px" align="center" justify="center" gap={0}>
          <Avatar
            src={CheckImg}
            alt="invite"
            bg="white"
            style={{ width: '150px', height: '150px' }}
          />
          <Text mt="32px" mb="10px" fw={700} fz={20}>
            Complete
          </Text>
          <Text fw={400} fz="sm" c="#94A3B8">
            You earn 500 points!
          </Text>
        </Stack>
      </Modal>
    </Box>
  )
}
