'use client'

import { createTheme } from '@mantine/core'
import { colors } from './colors'
import { Button } from '@mantine/core'

const titleFF = 'var(--font-title)'
const bodyFF = 'var(--font-body)'
const monoFF = 'var(--font-mono)'

export const theme = createTheme({
  focusRing: 'never',
  black: '#0f0f0f',
  white: '#f8f8f2',
  primaryShade: { light: 6, dark: 5 },
  primaryColor: 'blue',
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
    Button: Button.extend({
      defaultProps: { ff: titleFF },
    }),
  },
})
