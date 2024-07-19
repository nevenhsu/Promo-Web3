import * as _ from 'lodash-es'
import UserModel from '@/models/user'
import type { User, TUser, LinkedAccount } from '@/models/user'

export async function createUser(privyId: string, data?: Partial<TUser>) {
  try {
    const user = await UserModel.create({ privyId, ...data })
    console.log('User created:', user)
    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function getUserById(_id: string) {
  try {
    const user = await UserModel.findById(_id)

    if (!user) {
      console.log('No user found with the id.')
      return null // Or throw an error or handle it as per your application requirements
    }

    return user
  } catch (error) {
    console.error('Error finding user:', error)
    throw error
  }
}

export async function getUserByUsername(username: string) {
  try {
    const user = await UserModel.findOne({ username })

    if (!user) {
      console.log('No user found with the specified username.')
      return null // Or throw an error or handle it as per your application requirements
    }

    return user
  } catch (error) {
    console.error('Error finding user:', error)
    throw error
  }
}

export async function updateUserById(_id: string, updateData: Partial<User>) {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true } // Options to return the updated document
    )

    if (!updatedUser) {
      console.log('No user found with the specified ID.')
      return null // Optionally, handle the absence of the user more formally here
    }

    console.log('Updated user:', updatedUser)
    return updatedUser
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export function filterUserData(data: any) {
  return _.pick(data, ['username', 'name', 'details'])
}

export async function removeLinkAccount(_id: string, platform: string) {
  try {
    const result = await UserModel.findOneAndUpdate(
      { _id },
      {
        $pull: { linkedAccounts: { platform } },
      },
      { new: true }
    )
    return result
  } catch (error) {
    console.error('Error removing linked account:', error)
    throw error
  }
}

export async function updateLinkAccount(_id: string, data: LinkedAccount) {
  try {
    const { userId, platform, username = '' } = data

    if (!_id || !userId || !platform) {
      throw new Error('Missing required fields')
    }

    // Update the linked account if it already exists
    const result = await UserModel.findOneAndUpdate(
      { _id, 'linkedAccounts.platform': platform },
      {
        $set: {
          'linkedAccounts.$.userId': userId,
          'linkedAccounts.$.username': username,
          'linkedAccounts.$.platform': platform,
        },
      },
      { new: true }
    )

    // If the linked account does not exist, insert a new one
    if (!result) {
      const upsertResult = await UserModel.findOneAndUpdate(
        { _id },
        {
          $push: { linkedAccounts: data },
        },
        { new: true, upsert: true }
      )

      console.log('Upserted document:', upsertResult)
      return upsertResult
    }

    console.log('Updated document:', result)
    return result
  } catch (error) {
    console.error('Error updating linked account:', error)
    throw error
  }
}
