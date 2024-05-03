'use client'

import { useAppSelector } from '@/hooks/redux'
import { AspectRatio, Box, Image, Group, Avatar, Button, Text } from '@mantine/core'
import TitleBar from '@/components/TitleBar'

export default function Wallet() {
  const { _id, fetched, data } = useAppSelector(state => state.user)
  const { username, name, details } = data

  return <Box>Wallet</Box>
}
