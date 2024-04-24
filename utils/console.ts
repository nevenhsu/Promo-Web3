'use client'

const error = console.error
console.error = (...args: any) => {
  // hide warning
  if (/defaultProps|lowercase|MetaMask/.test(args[0])) return
  error(...args)
}
