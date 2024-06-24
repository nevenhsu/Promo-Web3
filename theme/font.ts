import { Inter, Source_Serif_4, Roboto_Mono, Noto_Sans_TC } from 'next/font/google'

const title = Inter({
  weight: ['200', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-title',
})

const body = Source_Serif_4({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-body',
})

const mono = Roboto_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--next-mono',
})

// const tc = Noto_Sans_TC({
//   weight: ['200', '400', '700'],
//   subsets: ['latin'],
//   variable: '--next-tc',
// })

export const fontVariables = `${title.variable} ${body.variable} ${mono.variable}`
