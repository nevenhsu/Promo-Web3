import { Link } from '@/navigation'
import { Button } from '@mantine/core'

export default function Index() {
  return (
    <>
      <Link href="/home">
        <Button>Get Started</Button>
      </Link>
    </>
  )
}
