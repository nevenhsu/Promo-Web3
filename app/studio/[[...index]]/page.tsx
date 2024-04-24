import Studio from '@/components/sanity/Studio'
// Set the right `viewport`, `robots` and `referer` meta tags
import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio'
import type { Metadata, Viewport } from 'next'

// Ensures the Studio route is statically generated
export const dynamic = 'force-static'

// Set the right `viewport`, `robots` and `referer` meta tags
export const metadata: Metadata = {
  ...studioMetadata,
  // Overrides the title until the Studio is loaded
  title: 'Loading Studio…',
}

export const viewport: Viewport = {
  ...studioViewport,
  // Overrides the viewport to resize behavior
  interactiveWidget: 'resizes-content',
}

export default function StudioPage() {
  return <Studio />
}
