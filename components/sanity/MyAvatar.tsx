import { Box, Group } from '@mantine/core'
import { Body, Caption } from '@/components/Fonts'
import SanityImage from '@/components/sanity/Image'
import type { AvatarData } from '@/types/avatar'

export default function MyAvatar({
  data,
  showBio,
}: {
  data?: Partial<AvatarData>
  showBio?: boolean
}) {
  const { image, name, bio } = data || {}

  return (
    <Group gap={12} wrap="nowrap">
      <Box
        w={{ base: 32, sm: 40 }}
        h={{ base: 32, sm: 40 }}
        style={{
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        {image?.asset ? <SanityImage image={image.asset} /> : null}
      </Box>
      <Box>
        <Body fw="bold">{name}</Body>
        {showBio && bio ? <Caption>{bio}</Caption> : null}
      </Box>
    </Group>
  )
}
