'use client'

import Image from 'next/image'
import { Group, Stack, Box, Title, Text, Space, Divider, Button } from '@mantine/core'
import RwdLayout from '@/components/share/RwdLayout'
import { PiLightning, PiCalendarBlank, PiPersonSimpleRun } from 'react-icons/pi'
import classes from '../index.module.css'

type ActivityDetailProps = { activityId: string }

export default function ActivityDetail({ activityId }: ActivityDetailProps) {
  return (
    <>
      <Box>
        <Image
          className={classes.cover}
          src="/images/activity-cover.png"
          width={1179}
          height={648}
          alt="cover"
        />
      </Box>

      <RwdLayout pt={24}>
        <Stack gap="lg">
          <Title order={4}>Taitra Tech Promotion</Title>

          <Text fz={14} c="dimmed">
            RAMAYANA BALLET at Purawisata – Jogjakarta – Indonesia, has held the record for
            every-night stage without ever being off for 42 YEARS, and received an award from The
            Indonesia Records Museum (MURI) in 2001.
          </Text>

          <Text fw={700} c="orange.6">
            200 Points
          </Text>

          <Divider />

          <Title order={5}>Event Details</Title>

          <Stack gap="sm">
            <Group gap="sm">
              <PiLightning size={20} />
              <Text fz={14}>Repost on X</Text>
            </Group>

            <Group gap="sm">
              <PiPersonSimpleRun size={20} />
              <Text fz={14}> 123 Participants</Text>
            </Group>

            <Group gap="sm">
              <PiCalendarBlank size={20} />
              <Text fz={14}>14 May 2024 ~ 14 Jun 2024</Text>
            </Group>
          </Stack>

          <Group grow wrap="nowrap">
            <Button>Mark complete</Button>
            <Button variant="outline">Open link</Button>
          </Group>

          <Divider />

          {/* Embedded Post */}
          <Box className={classes.embedded}>
            <Box
              dangerouslySetInnerHTML={{
                __html: `<blockquote class="twitter-tweet"><p lang="en" dir="ltr">NEW: 🇺🇸 US Congressman Patrick McHenry also gives speech supporting overturning SEC rule that prevents regulated financial firms from custodying <a href="https://twitter.com/hashtag/Bitcoin?src=hash&amp;ref_src=twsrc%5Etfw">#Bitcoin</a> and crypto. 👏<br><br>He argues that banks should also be custodying spot Bitcoin ETF funds 👀<br> <a href="https://t.co/N5uINTkHT6">pic.twitter.com/N5uINTkHT6</a></p>&mdash; Bitcoin Magazine (@BitcoinMagazine) <a href="https://twitter.com/BitcoinMagazine/status/1788327051520278708?ref_src=twsrc%5Etfw">May 8, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`,
              }}
            />
          </Box>
        </Stack>
      </RwdLayout>

      <Space h={100} />
    </>
  )
}
