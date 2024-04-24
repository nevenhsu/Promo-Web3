import _ from 'lodash'
import { Box } from '@mantine/core'
import { extractIframeAttributes } from '@/utils/sanity/extractIframeAttributes'

type IframeProps = {
  title?: string
  code?: string
  height?: {
    base: string | undefined
    xs: string | undefined
    sm: string | undefined
    md: string | undefined
    lg: string | undefined
    xl: string | undefined
  }
  [key: string]: any
}

export function Iframe({ title, code, height }: IframeProps) {
  const { style, ...attributes } = extractIframeAttributes(`${code}`)

  const hVal = _.mapValues(height, v => {
    const num = Number(v)
    if (!_.isNaN(num)) return num
    return v ? v : undefined
  })
  const hRwd = _.omitBy(hVal, _.isNil)
  const h = !_.isEmpty(hRwd) ? hRwd : (attributes.height as string) || 500

  return (
    <Box h={h}>
      <iframe title={title || ' '} {...attributes} width="100%" height="100%" allowFullScreen />
    </Box>
  )
}
