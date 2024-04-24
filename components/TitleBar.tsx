'use client'

import { useRouter } from 'next/navigation'
import { Group, ActionIcon, Title, Box } from '@mantine/core'
import { IoIosArrowBack } from 'react-icons/io'

type TitleBarProps = {
  title: string
  rightSection?: React.ReactNode
}

export default function TitleBar(props: TitleBarProps) {
  const { title } = props
  const router = useRouter()
  return (
    <Group justify="space-between" mb={16} wrap="nowrap">
      <ActionIcon variant="transparent" onClick={() => router.back()}>
        <IoIosArrowBack size={24} />
      </ActionIcon>
      <Title fz={20}>{title}</Title>
      <Box w={28} h={28}>
        {props.rightSection}
      </Box>
    </Group>
  )
}
