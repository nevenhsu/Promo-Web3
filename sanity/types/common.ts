export type SanityArray<T> = Array<T & { _key: string }>

export type SanityReference = { _ref: string }

export type SanitySlug = { slug: { current: string } }
