'use client'
import { useMantineTheme } from '@mantine/core'
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
} from '@mantine/core'
// icons
import { IoWallet } from 'react-icons/io5'
import { LiaHistorySolid } from 'react-icons/lia'

export default function Home() {
  const theme = useMantineTheme()

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
              <Text fw={700} fz={14} ff="Inter">
                $ 300,000
              </Text>
              <Text fz={12} ff="Open Sans">
                Available balance
              </Text>
            </Stack>
          </Flex>
          {/* action */}
          <Flex mih={50} gap="xs" justify="center" align="center" direction="row" wrap="wrap">
            {/* History */}
            <Stack style={{ cursor: 'pointer' }} align="center" justify="flex-start" gap={0}>
              <Avatar variant="filled" radius="sm" size="md" color="#2C98FF">
                <LiaHistorySolid color="white" size="1.5rem" />
              </Avatar>
              <Text mt={1} fz={12} c="#1F2937" ff="Open Sans">
                History
              </Text>
            </Stack>
          </Flex>
        </Group>
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
