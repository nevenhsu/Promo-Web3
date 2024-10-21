'use client'

import * as _ from 'lodash-es'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import useQuery from '@/sanity/hooks/useQuery'
import { pageQuery } from '@/sanity/queries'
import { useRwdValue } from '@/hooks/useRwdValue'
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
  const imageAsset = useRwdValue(mainImage, 'asset')

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
          <Stack>
            <PageInfo data={data} />
            <Headline>{title}</Headline>
            {author ? <MyAvatar data={author} /> : null}
          </Stack>
        </MotionSlide>
      </RwdLayout>

      {/*   Content   */}
      <Box
        style={{
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
              <MyPortableText content={content || []} />
            </Box>
          </motion.div>
        </RwdLayout>
      </Box>

      <Space h={100} />
    </>
  )
}
