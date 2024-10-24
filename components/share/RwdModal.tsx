'use client'

import { useAppContext } from '@/store/AppContext'
import { Modal, Drawer } from '@mantine/core'
import type { ModalBaseProps, MantineSize } from '@mantine/core'

type RwdModalProps = ModalBaseProps & {
  children: React.ReactNode
  opened: boolean
  title?: React.ReactNode
  withCloseButton?: boolean
  onClose: () => void
  sizes?: {
    mobile?: MantineSize | (string & {}) | number
    tablet?: MantineSize | (string & {}) | number
  }
}

export default function RwdModal(props: RwdModalProps) {
  const { opened, title, withCloseButton, sizes, onClose } = props
  const {
    state: { viewportSize },
  } = useAppContext()

  const isMobile = viewportSize.width < 576

  if (isMobile) {
    return (
      <Drawer
        radius="md"
        position="bottom"
        size={sizes?.mobile}
        {...props}
        opened={opened}
        title={title}
        onClose={onClose}
        withCloseButton={withCloseButton}
      >
        {props.children}
      </Drawer>
    )
  }

  return (
    <Modal
      centered
      size={sizes?.tablet}
      {...props}
      opened={opened}
      title={title}
      onClose={onClose}
      withCloseButton={withCloseButton}
    >
      {props.children}
    </Modal>
  )
}
