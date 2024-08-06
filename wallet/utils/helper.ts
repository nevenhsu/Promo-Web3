export function unifyAddress(address: string) {
  return address.toLowerCase()
}

export function wait(milliseconds = 1000, any: any = undefined) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(any)
    }, milliseconds)
  })
}

export function formatAddress(address?: string): string {
  if (!address) {
    return ''
  }

  const start = address.slice(0, 8) // Extract the first 8 characters
  const end = address.slice(-8) // Extract the last 8 characters
  return `${start}...${end}` // Combine them with an ellipsis
}
