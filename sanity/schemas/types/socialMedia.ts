import * as _ from 'lodash-es'
import { defineType } from 'sanity'
import { getIcon, getName, SocialIcon } from '@/sanity/lib/socialIcon'

export default defineType({
  title: 'Social Media',
  name: 'socialMedia',
  type: 'object',
  fields: [
    {
      title: 'Icon',
      name: 'icon',
      type: 'string',
      options: {
        list: _.map(SocialIcon, value => ({ title: getName(value), value })),
      },
    },
    { title: 'Username', name: 'username', type: 'string' },
    {
      name: 'href',
      type: 'url',
      validation: Rule =>
        Rule.uri({
          allowRelative: false,
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    },
    { title: 'qrcode', name: 'qrcode', type: 'image' },
    { title: 'No Popup', name: 'noPopup', type: 'boolean' },
  ],
  preview: {
    select: { icon: 'icon', username: 'username' },
    prepare(selection) {
      const { icon, username } = selection
      return {
        title: `${icon} - ${username || 'No username'}`,
        media: getIcon(icon),
      }
    },
  },
})
