import { Poppins, Fira_Sans, Roboto_Mono, Noto_Sans_TC } from 'next/font/google'

const title = Poppins({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-title',
})

const body = Fira_Sans({
  weight: ['400', '500', '700'],
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
