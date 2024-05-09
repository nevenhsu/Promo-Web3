import { Group, Stack, Paper, Text, Button, Box, Slider } from '@mantine/core'
import { levelPoints } from '@/types/db'
import Level0 from '@/public/icons/level-0.svg'
import Level1 from '@/public/icons/level-1.svg'
import Level2 from '@/public/icons/level-2.svg'
import Level3 from '@/public/icons/level-3.svg'
import Level4 from '@/public/icons/level-4.svg'
import classes from './index.module.css'

type LevelCardProps = {
  points: number
}

export default function LevelCard({ points }: LevelCardProps) {
  return (
    <>
      <Paper p="md" radius="md" withBorder>
        <Stack>
          <Group justify="space-between">
            <Text fw={500}>Your Level</Text>
            <Button variant="light">Detail</Button>
          </Group>

          <Group className={classes.level} justify="space-between">
            <Box c={getColor(isMatchLevel(points, levelPoints[0].min, levelPoints[0].max))}>
              <Level0 />
              <Text>Star</Text>
            </Box>
            <Box c={getColor(isMatchLevel(points, levelPoints[1].min, levelPoints[1].max))}>
              <Level1 />
              <Text>Bronze</Text>
            </Box>
            <Box c={getColor(isMatchLevel(points, levelPoints[2].min, levelPoints[2].max))}>
              <Level2 />
              <Text>Silver</Text>
            </Box>
            <Box c={getColor(isMatchLevel(points, levelPoints[3].min, levelPoints[3].max))}>
              <Level3 />
              <Text>Gold</Text>
            </Box>
            <Box c={getColor(isMatchLevel(points, levelPoints[4].min, levelPoints[4].max))}>
              <Level4 />
              <Text>Platinum</Text>
            </Box>
          </Group>

          <Slider
            value={points}
            label={null}
            color="orange.4"
            my="xl"
            min={-2500}
            max={102500}
            marks={[
              { value: 0, label: '0' },
              { value: 25000, label: '25k' },
              { value: 50000, label: '50k' },
              { value: 75000, label: '75k' },
              { value: 100000, label: '100k' },
            ]}
          />

          <Text fz={14}>
            Gain more
            <Box component="b" c="orange">
              {` ${'19,000'} `}
            </Box>
            and wait until <b>31 Dec 2024</b> to reach gold
          </Text>
        </Stack>
      </Paper>
    </>
  )
}

function isMatchLevel(points: number, level: number, nextLevel: number) {
  if (points >= level && points < nextLevel) {
    return true
  }
  if (points < level) {
    return false
  }
  if (points > nextLevel) {
    return undefined
  }
}

function getColor(status: boolean | undefined) {
  if (status === true) {
    return 'orange.4'
  }
  if (status === false) {
    return 'gray.3'
  }
  return 'orange.1'
}
