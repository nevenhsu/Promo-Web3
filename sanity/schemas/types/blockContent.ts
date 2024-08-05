import { defineType, defineArrayMember } from 'sanity'
import { IoIosLink } from 'react-icons/io'
import Highlight from '@/components/sanity/Highlight'
import Dimmed from '@/components/sanity/Dimmed'
import Transparent from '@/components/sanity/Transparent'
import Divider from '@/components/sanity/Divider'
import { FullDividerPreview } from '@/components/sanity/FullDivider'
import { BiHeading } from 'react-icons/bi'
import { PiCircleHalfDuotone } from 'react-icons/pi'
import { CiText } from 'react-icons/ci'
import {
  SanityHeadline,
  SanityTitle,
  SanitySubtitle,
  SanityBody,
  SanityCaption,
  SanitySmall,
} from '@/components/sanity/Fonts'

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: 'Normal', value: 'normal', component: SanityBody },
        { title: 'Headline', value: 'headline', component: SanityHeadline },
        { title: 'Title', value: 'title', component: SanityTitle },
        { title: 'Subtitle', value: 'subtitle', component: SanitySubtitle },
        { title: 'Caption', value: 'caption', component: SanityCaption },
        { title: 'Small', value: 'small', component: SanitySmall },
        { title: 'Quote', value: 'blockquote' },
        { title: 'Divider', value: 'divider', component: Divider },
        { title: 'Divider (Full)', value: 'fullDivider', component: FullDividerPreview },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
          { title: 'Highlight', value: 'highlight', icon: BiHeading, component: Highlight },
          { title: 'Dimmed', value: 'dimmed', icon: PiCircleHalfDuotone, component: Dimmed },
          { title: 'Transparent', value: 'transparent', icon: CiText, component: Transparent },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          //this is our external link object which we override from the default by defining it
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                validation: Rule =>
                  Rule.uri({
                    allowRelative: false,
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
            ],
          },

          // this is our internal link object which is a reference to page documents
          {
            name: 'internalLink',
            type: 'object',
            title: 'Web link',
            // we can add the icon which will show in the toolbar by importing an icon from a library or pasting in a react component.
            // we use import { LinkIcon } from '@sanity/icons' in this case
            icon: IoIosLink,
            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Reference',
                to: [{ type: 'page' }],
              },
            ],
          },
        ],
      },
    },
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      title: 'RWD',
      name: 'rwd',
      type: 'rwd',
    }),
    defineArrayMember({
      title: 'Space',
      name: 'space',
      type: 'reference',
      to: [{ type: 'space' }],
    }),
    defineArrayMember({
      type: 'image',
      fields: [
        { name: 'lottie', type: 'lottie' },
        { title: 'Hide Image', name: 'hidden', type: 'boolean' },
      ],
      options: { hotspot: true },
    }),
    defineArrayMember({ title: 'Table', name: 'mTable', type: 'mTable' }),
    defineArrayMember({ title: 'Number List', name: 'numberList', type: 'numberList' }),
    defineArrayMember({ title: 'Title Card', name: 'titleCard', type: 'titleCard' }),
    defineArrayMember({ title: 'Content Card', name: 'contentCard', type: 'contentCard' }),
    defineArrayMember({ title: 'Text Card', name: 'textCard', type: 'textCard' }),
    defineArrayMember({ title: 'Member', name: 'member', type: 'member' }),
    defineArrayMember({ title: 'Iframe', name: 'iframe', type: 'iframe' }),
  ],
})
