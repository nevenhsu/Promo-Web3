import { forwardRef, useState, useImperativeHandle, Ref } from 'react'
import { Drawer, Text, Flex, Stack } from '@mantine/core'
import * as _ from 'lodash-es'
// utils
import { Level } from '@/utils/general'
// components
import { Grid, Button } from '@mantine/core'
// assets
import BronzeIcon from '@/components/share/icon/BronzeIcon'
import SilverIcon from '@/components/share/icon/SilverIcon'
import GoldIcon from '@/components/share/icon/GoldIcon'
import PlatinumIcon from '@/components/share/icon/PlatinumIcon'

export interface LevelDetailRef {
  open: () => void
  close: () => void
}

interface LevelDetailProps {
  open?: boolean
}

const LevelList = [
  {
    level: Level.Bronze,
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    icon: <BronzeIcon color="#FFA41B" />,
  },
  {
    level: Level.Silver,
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    icon: <SilverIcon color="#FFA41B" />,
  },
  {
    level: Level.Gold,
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    icon: <GoldIcon color="#FFA41B" />,
  },
  {
    level: Level.Platinum,
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    icon: <PlatinumIcon color="#FFA41B" />,
  },
]

const LevelDetail = forwardRef<LevelDetailRef, LevelDetailProps>((props, ref) => {
  const { open: _open = false } = props
  const [open, setOpen] = useState(_open)

  useImperativeHandle(ref, () => ({
    open() {
      setOpen(true)
    },
    close() {
      setOpen(false)
    },
  }))

  return (
    <Drawer.Root position="bottom" opened={open} size="md" onClose={() => setOpen(false)}>
      <Drawer.Overlay />
      <Drawer.Content
        style={{
          borderRadius: '28px 28px 0 0',
        }}
      >
        <Drawer.Header>
          <Drawer.Title>
            <Text fz={14} fw={400} c="#8683A1">
              List Member level
            </Text>
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          {_.map(LevelList, el => (
            <Grid gutter="xs" mb="16px">
              <Grid.Col span="content">{el?.icon}</Grid.Col>
              <Grid.Col span="auto">
                <Stack gap={0}>
                  <Text fw={700} fz={16}>
                    {el?.level}
                  </Text>
                  <Text fz={12} c="#6B7280" style={{ lineHeight: '155%' }}>
                    {el?.desc}
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
          ))}
          <Flex gap="md" justify="center" align="center" direction="row" wrap="wrap">
            <Button size="md" radius="sx">
              Tututp
            </Button>
          </Flex>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
})

LevelDetail.displayName = 'LevelDetail'

export default LevelDetail
