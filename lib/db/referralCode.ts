import ReferralCodeModel from '@/models/referralCode'
import type { TUser } from '@/models/user'

export async function getReferralCode(userId: string) {
  let doc = await ReferralCodeModel.findOne({ _user: userId })

  if (!doc) {
    const newDoc = new ReferralCodeModel({ _user: userId })
    const doc = await newDoc.save()
    return doc
  }

  return doc
}

export async function getRefererByCode(code: string) {
  const doc = await ReferralCodeModel.findOne({ code }).lean().populate<{ _user: TUser }>('_user')
  return doc
}
