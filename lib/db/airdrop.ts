import AirdropModel from '@/models/airdrop'

export async function getAllAirdrops(userId: string) {
  const airdrops = await AirdropModel.find({ _user: userId }).lean()
  return airdrops
}
