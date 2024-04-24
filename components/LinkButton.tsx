import { forwardRef } from 'react'
import Link from 'next/link'
import { Button } from '@mantine/core'
import { IoIosArrowForward } from 'react-icons/io'
import type { ButtonProps } from '@mantine/core'

const LinkButton = forwardRef<HTMLAnchorElement, ButtonProps & { href: string }>(
  function LinkButton(props, ref) {
    return (
      <Button
        justify="space-between"
        variant="transparent"
        rightSection={<IoIosArrowForward size={16} />}
        {...props}
        ref={ref}
        component={Link}
      />
    )
  }
)

export default LinkButton
