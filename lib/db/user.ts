import UserModel, { type User } from '@/models/user'

export async function createUser(privyId: string) {
  try {
    const user = await UserModel.create({ privyId })
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
