'use client'

import { InstagramEmbed } from 'react-social-media-embed'

export default function InstagramMedia({ postLink }: { postLink: string }) {
  return (
    <InstagramEmbed
      url={`https://www.instagram.com/p/${postLink}/`}
      width="100%"
      style={{
        maxWidth: 480,
      }}
    />
  )
}
