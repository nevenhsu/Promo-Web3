import _ from 'lodash'
import clsx from 'clsx'
import { Divider } from '@mantine/core'
import classes from './index.module.css'

export default function MyDivider({ children }: { children: React.ReactNode }) {
  const hasText = _.get(children, '0.props.text.text')

  return (
    <>
      <Divider
        className={clsx({
          [classes['no-margining']]: !hasText,
        })}
        my={12}
        label={children}
      />
    </>
  )
}
