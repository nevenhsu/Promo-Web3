export function isValidXPostLink(str: string) {
  const pattern = /^https:\/\/(www\.)?x\.com\/[a-zA-Z0-9_]+\/status\/\d+\/?(?:\?.*)?$/
  return pattern.test(str)
}

export function getXPostId(url: string) {
  const pattern = /^https:\/\/(www\.)?x\.com\/[a-zA-Z0-9_]+\/status\/(\d+)\/?(?:\?.*)?$/
  const match = url.match(pattern)

  return match ? match[2] || '' : ''
}

export function isValidInstagramPostLink(str: string) {
  const pattern = /^https:\/\/(www\.)?instagram\.com\/p\/[a-zA-Z0-9_-]+\/?(?:\?.*)?$/
  return pattern.test(str)
}

export function getInstagramPostId(url: string) {
  const pattern = /^https:\/\/(www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?.*$/
  const match = url.match(pattern)

  return match ? match[2] || '' : ''
}
