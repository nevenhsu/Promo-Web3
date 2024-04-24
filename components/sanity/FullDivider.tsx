import _ from 'lodash'
import clsx from 'clsx'
import { Divider } from '@mantine/core'
import classes from './index.module.css'

export default function FullDivider({ children }: { children: React.ReactNode }) {
  const hasText = _.get(children, '0.props.text.text')

  return (
    <>
      <Divider
        className={clsx({
          [classes['no-margining']]: !hasText,
        })}
        my={12}
        label={children}
        style={{
          position: 'relative',
          width: '200vw',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
    </>
  )
}

export function FullDividerPreview({ children }: { children: React.ReactNode }) {
  const hasText = _.get(children, '0.props.text.text')

  return (
    <>
      <Divider
        className={clsx({
          [classes['no-margining']]: !hasText,
        })}
        mt={12}
        mb={20}
        label={children}
        style={{
          position: 'relative',
          width: 'calc(100% + 96px)',
          left: -32,
        }}
      />
    </>
  )
}
