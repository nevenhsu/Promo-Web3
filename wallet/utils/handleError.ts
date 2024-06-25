export enum ErrorType {
  Unknown = 'Unknown',
  Disconnected = 'Disconnected',
  InsufficientFunds = 'InsufficientFunds',
}

export function classifyError(err: unknown) {
  if (err instanceof Error) {
    const msg = err.message

    if (msg.includes('insufficient funds')) {
      return ErrorType.InsufficientFunds
    }

    if (msg === 'Disconnected') {
      return ErrorType.Disconnected
    }
  }
  return ErrorType.Unknown
}
