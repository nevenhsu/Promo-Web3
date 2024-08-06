'use client'

import _ from 'lodash'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import useQuery from '@/hooks/useQuery'
import { pageQuery } from '@/sanity/queries'
import { useScreenQueryValue } from '@/hooks/useScreenQuery'
import { motion } from 'framer-motion'
import { MotionSlide, MotionBlur } from '@/components/motion'
import { MyPortableText } from '@/components/common'
import { Box, Stack, Space } from '@mantine/core'
import { Headline } from '@/components/Fonts'
import PageInfo from './PageInfo'
import RwdLayout from '@/components/share/RwdLayout'
import SanityImage from '@/components/sanity/Image'
import MyAvatar from '@/components/sanity/MyAvatar'
import { variables } from '@/theme/cssVariables'
import type { PageData } from '@/sanity/types/page'
import classes from './index.module.css'

const headerHeight = variables.header.height

type PageProps = {
  slug: string
  lang: string
  initialData: Partial<PageData>
}

export default function Blog({ slug, lang, initialData }: PageProps) {
  const [data] = useQuery<Partial<PageData>>(initialData, pageQuery, { slug, lang })
  const { title, content, mainImage, author } = data
  const show = !_.isEmpty(data)
  const [isInit, setInit] = useState(false)
  const imageAsset = useScreenQueryValue(mainImage, 'asset')

  useEffect(() => {
    if (show) {
      setInit(true)
    }
  }, [show])

  if (!show) return null

  return (
    <>
      {imageAsset ? (
        <Box pos="relative" h="30vh" style={{ pointerEvents: 'none' }}>
          {/*   Background   */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <Box
              className={clsx('absolute-horizontal', classes.bg, { hide: !title })}
              top={`-${headerHeight}px`}
              h={`calc(100% + ${headerHeight}px)`}
              w="100vw"
            >
              {/*   Cover   */}
              <Box className={clsx('absolute-center', classes.cover)}>
                <MotionBlur delay={1}>
                  <Box>
                    <SanityImage image={imageAsset} style={{ height: '100%' }} />
                  </Box>
                </MotionBlur>
              </Box>
            </Box>
          </motion.div>
        </Box>
      ) : null}

      {/*   Title   */}

      <Space h={{ base: 40, sm: 80 }} />

      <RwdLayout>
        <MotionSlide delay={1}>
          <Box w={{ base: '100%', sm: '66.66%', lg: '60%' }} mx="auto">
            <Stack>
              <PageInfo data={data} />
              <Headline>{title}</Headline>
              {author ? <MyAvatar data={author} /> : null}
            </Stack>
          </Box>
        </MotionSlide>
      </RwdLayout>

      {/*   Content   */}
      <Box
        style={{
          width: '100vw',
          overflowX: 'hidden',
        }}
      >
        <RwdLayout>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: isInit ? 0 : 2 }}
          >
            <Box pos="relative" py={{ base: 40 }}>
              <Box w={{ base: '100%', sm: '66.66%', lg: '60%' }} mx="auto">
                <MyPortableText content={content || []} />
              </Box>
            </Box>
          </motion.div>
        </RwdLayout>
      </Box>

      <Space h={100} />
    </>
  )
}
