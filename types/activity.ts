import type { ActivityAirdrop, TActivity } from '@/models/activity'
import type { TUserToken } from '@/models/userToken'

export type TAirdrop = Omit<ActivityAirdrop, '_userToken'> & { _userToken: TUserToken }
export type TActivityWithAirdrop = Omit<TActivity, 'airdrop'> & { airdrop: TAirdrop }
