import 'sanity'

declare module 'sanity' {
  // redeclare StringOptions; it will be merged with StringOptions in the sanity module
  export interface SanityDocument {
    slug?: { [k: string]: any }
  }
}
