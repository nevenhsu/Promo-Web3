import { Link } from '@/navigation'
import { Group, Text } from '@mantine/core'
import { PiHouse, PiRocket, PiTrophy, PiCardholder } from 'react-icons/pi'
import classes from './index.module.css'

export default function MobileFooter() {
  return (
    <>
      <Group className={classes.footer} h={56} grow>
        <Link href="/home">
          <PiHouse size={24} />
          <Text>Home</Text>
        </Link>
        <Link href="/activity">
          <PiRocket size={24} />
          <Text>Activity</Text>
        </Link>
        <Link href="/record">
          <PiTrophy size={24} />
          <Text>Record</Text>
        </Link>
        <Link href="/wallet">
          <PiCardholder size={24} />
          <Text>Wallet</Text>
        </Link>
      </Group>
    </>
  )
}
