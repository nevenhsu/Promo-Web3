import { InputProps } from 'sanity'
import { extractIframeAttributes } from '@/sanity/lib/extractIframeAttributes'
import { Stack, Badge } from '@mantine/core'

export default function IframeInput(props: InputProps) {
  const { value } = props
  const attributes = extractIframeAttributes(`${value}`)
  const isValid = Boolean(attributes.src)
  return (
    <Stack>
      {props.renderDefault(props)}
      <Badge c={isValid ? 'green' : 'red'} style={{ visibility: value ? 'visible' : 'hidden' }}>
        {isValid ? 'Valid' : 'Invalid'}
      </Badge>
    </Stack>
  )
}
