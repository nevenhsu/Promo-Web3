import AirdropModel from '@/models/airdrop'

export async function getAllAirdrops(userId: string) {
  const airdrops = await AirdropModel.find({ _user: userId }).lean()
  return airdrops.map(o => ({
    ...o,
    receivedAmount: o.receivedAmount?.toString() || '0',
    pendingAmount: o.pendingAmount?.toString() || '0',
  }))
}
