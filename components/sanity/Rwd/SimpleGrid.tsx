import { SimpleGrid, type SimpleGridProps } from '@mantine/core'

export default function RwdSimpleGrid(props: SimpleGridProps) {
  return (
    <SimpleGrid
      spacing={{ base: 24, lg: 40 }}
      verticalSpacing={{ base: 24, sm: 40, lg: 60 }}
      {...props}
    />
  )
}
