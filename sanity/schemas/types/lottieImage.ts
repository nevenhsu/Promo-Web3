import { defineType } from 'sanity'

export default defineType({
  title: 'Lottie Image',
  name: 'lottieImage',
  type: 'image',
  options: { hotspot: true },
  fields: [
    { name: 'lottie', type: 'lottie' },
    { title: 'Hide Image', name: 'hidden', type: 'boolean' },
  ],
})
