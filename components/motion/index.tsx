import { motion, type MotionProps } from 'framer-motion'

type MyMotionProps = MotionProps & {
  children: React.ReactNode
  delay?: number
  direction?: 'left' | 'right' | 'up' | 'down' | 'none'
}

export function MotionSlide({ delay, children, direction = 'up', ...rest }: MyMotionProps) {
  const x = direction === 'left' ? 20 : direction === 'right' ? -20 : 0
  const y = direction === 'up' ? 20 : direction === 'down' ? -20 : 0
  return (
    <motion.div
      initial={{ x, y, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: delay || 0 }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function MotionBlur({ delay, children, direction = 'up', ...rest }: MyMotionProps) {
  const x = direction === 'left' ? 20 : direction === 'right' ? -20 : 0
  const y = direction === 'up' ? 20 : direction === 'down' ? -20 : 0
  return (
    <motion.div
      initial={{ x, y, opacity: 0, filter: 'blur(10px)' }}
      animate={{ x: 0, y: 0, opacity: 1, filter: 'blur(0)' }}
      transition={{ duration: 1, delay: delay || 0 }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
