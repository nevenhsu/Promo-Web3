import { Link } from '@/navigation'
import { Group, Box, Text } from '@mantine/core'
import {
  PiHouse,
  PiHouseFill,
  PiLightning,
  PiLightningFill,
  PiWallet,
  PiWalletFill,
  PiCrownSimple,
  PiCrownSimpleFill,
} from 'react-icons/pi'
import classes from './index.module.css'

export default function MobileFooter() {
  return (
    <>
      <Group className={classes.footer} h={80} grow>
        <Link href="/home">
          <PiHouse size={24} />
          <Text>Home</Text>
        </Link>
        <Link href="/activity">
          <PiLightning size={24} />
          <Text>Activity</Text>
        </Link>
        <Link href="/level">
          <PiCrownSimple size={24} />
          <Text>Level</Text>
        </Link>
        <Link href="/wallet">
          <PiWallet size={24} />
          <Text>Wallet</Text>
        </Link>
      </Group>
    </>
  )
}
