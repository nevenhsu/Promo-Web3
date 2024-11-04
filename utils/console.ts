'use client'

const warn = console.warn
console.warn = (...args: any) => {
  // hide warning
  if (/Coinbase|Source/.test(args[0])) return
  warn(...args)
}
