import { MockToken, MockToken__factory } from './typechain-types'

export type Contracts = {
  token: MockToken
}

export const getToken = (signer: any) =>
  new MockToken__factory(signer).attach(process.env.NEXT_PUBLIC_TOKEN) as MockToken
