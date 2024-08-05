import type { CSSVariablesResolver } from '@mantine/core'

export const variables = {
  header: { height: 64 },
}

export const resolver: CSSVariablesResolver = theme => ({
  variables: {},
  light: {},
  dark: {},
})
