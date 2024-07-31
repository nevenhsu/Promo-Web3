'use client'

const error = console.error
console.error = (...args: any) => {
  // hide warning
  if (/defaultProps|lowercase|MetaMask/.test(args[0])) return
  error(...args)
}

const warn = console.warn
console.warn = (...args: any) => {
  // hide warning
  if (/Coinbase/.test(args[0])) return
  warn(...args)
}
