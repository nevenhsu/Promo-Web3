import sharp from 'sharp'

export async function toWebp(dataURI: string, size?: { width: number; height: number }) {
  const arr = dataURI.split(',')
  let img = sharp(Buffer.from(arr[1], 'base64'))

  if (size && size.width && size.height) {
    img = img.resize(size.width, size.height)
  }

  const buffer = await img.webp().toBuffer()
  // const b64 = buffer.toString('base64')
  // return `data:image/webp;base64,${b64}`
  return buffer
}

export async function svgToPng(svg: string) {
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer()
  // const b64 = buffer.toString('base64')
  // return `data:image/png;base64,${b64}`
  return buffer
}
