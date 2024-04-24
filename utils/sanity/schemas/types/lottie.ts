import { defineType } from 'sanity'

export default defineType({
  title: 'Lottie',
  name: 'lottie',
  type: 'file',
  options: {
    accept: '.json',
  },
})
