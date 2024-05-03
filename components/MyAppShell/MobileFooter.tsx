import { Link } from '@/navigation'
import { Group, Box, Text } from '@mantine/core'
import {
  RiHome4Fill,
  RiHome5Line,
  RiVipCrown2Fill,
  RiVipCrown2Line,
  RiUser3Fill,
  RiUser3Line,
} from 'react-icons/ri'
import { HiBolt, HiOutlineBolt } from 'react-icons/hi2'
import classes from './index.module.css'

export default function MobileFooter() {
  return (
    <>
      <Group className={classes.footer} h={88} grow>
        <Link href="/home">
          <RiHome5Line size={24} />
          <Text>Home</Text>
        </Link>
        <Link href="/activity">
          <HiOutlineBolt size={24} />
          <Text>Activity</Text>
        </Link>
        <Link href="/level">
          <RiVipCrown2Line size={24} />
          <Text>Level</Text>
        </Link>
        <Link href="/profile">
          <RiUser3Line size={24} />
          <Text>Profile</Text>
        </Link>
      </Group>
    </>
  )
}
