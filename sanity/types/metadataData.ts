export type MetadataData = {
  title: string
  description: string
  keywords: string[]
  author: string
  png: { url: string }
  svg: { url: string }
  cover: {
    url: string
    mimeType: string
    dimensions: {
      width: number
      height: number
    }
  }
}
