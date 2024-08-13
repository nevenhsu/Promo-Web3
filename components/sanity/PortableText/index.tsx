import { PortableText, type PortableTextReactComponents } from '@portabletext/react'
import { Headline, MyTitle, Subtitle, Body, Caption, Small, Blockquote } from '@/components/Fonts'
import { List } from '@mantine/core'
import Divider from '@/components/sanity/Divider'
import FullDivider from '@/components/sanity/FullDivider'
import Highlight from '@/components/sanity/Highlight'
import Dimmed from '@/components/sanity/Dimmed'
import Transparent from '@/components/sanity/Transparent'
import { Content, MTable, NumberList, TitleCard, ContentCard, TextCard } from '@/components/common'
import { RwdBlock, MySpace, MyLink, Member, LottieImage, Iframe } from '@/components/common'
import UnderlineMotion from '@/components/motion/Underline'
import type { PortableTextBlock } from 'sanity'
import classes from './index.module.css'

const myComponents: Partial<PortableTextReactComponents> = {
  block: {
    // customizing common block types
    normal: ({ children }) => <Body mb={8}>{children}</Body>,
    headline: ({ children }) => <Headline mb={8}>{children}</Headline>,
    title: ({ children }) => <MyTitle mb={8}>{children}</MyTitle>,
    subtitle: ({ children }) => <Subtitle mb={8}>{children}</Subtitle>,
    caption: ({ children }) => <Caption mb={8}>{children}</Caption>,
    small: ({ children }) => <Small>{children}</Small>,
    blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
    divider: ({ children }) => <Divider>{children}</Divider>,
    fullDivider: ({ children }) => <FullDivider>{children}</FullDivider>,
  },
  types: {
    image: ({ value }) => <LottieImage value={value} />,
    rwd: ({ value }) => <RwdBlock data={value} />,
    content: ({ value }) => <Content data={value} />,
    mTable: ({ value }) => <MTable data={value} />,
    numberList: ({ value }) => <NumberList data={value} />,
    titleCard: ({ value }) => <TitleCard data={value} />,
    contentCard: ({ value }) => <ContentCard data={value} />,
    textCard: ({ value }) => <TextCard data={value} />,
    space: ({ value }) => <MySpace data={value} />,
    member: data => {
      return <Member data={data.value} />
    },
    iframe: ({ value }) => <Iframe {...value} />,
  },
  list: {
    bullet: ({ children }) => <List>{children}</List>,
    number: ({ children }) => <List type="ordered">{children}</List>,
  },
  listItem: {
    bullet: ({ children }) => <List.Item className={classes.item}>{children}</List.Item>,
    number: ({ children }) => <List.Item className={classes.item}>{children}</List.Item>,
  },
  marks: {
    highlight: ({ children }) => <Highlight>{children}</Highlight>,
    dimmed: ({ children }) => <Dimmed>{children}</Dimmed>,
    transparent: ({ children }) => <Transparent>{children}</Transparent>,
    link: ({ children, value }) => {
      return (
        <MyLink href={value.href}>
          <UnderlineMotion>
            <strong>{children}</strong>
          </UnderlineMotion>
        </MyLink>
      )
    },
    internalLink: ({ children, value }) => {
      return (
        <MyLink href={`/${value.type}/${value.slug}`}>
          <UnderlineMotion>
            <strong>{children}</strong>
          </UnderlineMotion>
        </MyLink>
      )
    },
  },

  // marks: {
  //   link: ({children, value}) => {
  //     const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
  //     return (
  //       <a href={value.href} rel={rel}>
  //         {children}
  //       </a>
  //     )
  //   },
  // },
}

export function MyPortableText({ content }: { content: PortableTextBlock[] }) {
  return <PortableText value={content} components={myComponents} />
}
