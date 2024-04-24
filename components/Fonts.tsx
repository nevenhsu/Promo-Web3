import { Title, Text, Code } from '@mantine/core'
import type { TitleProps, TextProps } from '@mantine/core'

type MyTextProps = TextProps & { children: any }

export function Headline(props: TitleProps) {
  return <Title fz={{ base: 36, lg: 46 }} {...props} />
}

export function MyTitle(props: TitleProps) {
  return <Title fz={{ base: 24, lg: 30 }} {...props} />
}

export function Subtitle(props: TitleProps) {
  return <Title fz={{ base: 20, lg: 22 }} fw={500} {...props} />
}

export function Body(props: MyTextProps) {
  return <Text fz={{ base: 16, lg: 18 }} {...props} />
}

export function Caption(props: MyTextProps) {
  return <Text fz={{ base: 14, lg: 16 }} {...props} />
}

export function Small(props: MyTextProps) {
  return <Text fz={8} {...props} />
}

export function Blockquote({ children }: { children: any }) {
  return (
    <Code px={{ base: 8, sm: 10 }} py={6} display="inline-block">
      {children}
    </Code>
  )
}
