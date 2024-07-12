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
