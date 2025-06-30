'use client'

import { createTheme } from '@mantine/core'
import { colors } from './colors'
import { Button, ActionIcon } from '@mantine/core'

const titleFF = 'var(--font-title), var(--font-default)'
const bodyFF = 'var(--font-body), var(--font-default)'
const monoFF = 'var(--font-mono), var(--font-default)'

export const theme = createTheme({
  focusRing: 'never',
  black: '#090A0A',
  white: '#F7F9FA',
  primaryShade: { light: 5, dark: 4 },
  primaryColor: 'orange',
  colors,
  fontFamily: bodyFF,
  fontFamilyMonospace: monoFF,
  headings: {
    fontFamily: titleFF,
    fontWeight: '700',
  },
  spacing: {
    xs: 'calc(0.5rem * var(--mantine-scale))',
    sm: 'calc(0.75rem * var(--mantine-scale))',
    md: 'calc(1rem * var(--mantine-scale))',
    lg: 'calc(1.25rem * var(--mantine-scale))',
    xl: 'calc(2rem * var(--mantine-scale))',
  },
  radius: {
    xs: 'calc(0.5rem * var(--mantine-scale))',
    sm: 'calc(0.75rem * var(--mantine-scale))',
    md: 'calc(1rem * var(--mantine-scale))',
    lg: 'calc(1.5rem * var(--mantine-scale))',
    xl: 'calc(2rem * var(--mantine-scale))',
  },
  components: {
    Button: Button.extend({ defaultProps: { radius: 'xl', fw: 500 } }),
    ActionIcon: ActionIcon.extend({ defaultProps: { variant: 'transparent' } }),
  },
})
