import * as _ from 'lodash-es'

interface IframeAttributes {
  [key: string]: string | boolean | number
}

export function extractIframeAttributes(htmlString: string): IframeAttributes {
  const pattern = /([\w|data-]+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/gm

  const attributes: IframeAttributes = {}

  let attributeMatch: RegExpExecArray | null
  while ((attributeMatch = pattern.exec(htmlString))) {
    const [, attributeName, attributeValue] = attributeMatch
    attributes[attributeName] = toVal(attributeValue)
  }

  return attributes
}

function toVal(str: string) {
  const val = str.replace(/"|'/g, '')
  if (val === 'true') return true
  if (val === 'false') return false
  if (!_.isNaN(Number(val))) return Number(val)
  return val
}
