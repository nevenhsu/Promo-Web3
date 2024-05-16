import AdminModel, { type Admin } from '@/models/admin'

export async function createAdmin(userId: string, role: number) {
  try {
    const admin = new AdminModel({ userId, role })
    await admin.save()
    console.log('Admin created:', admin)
    return admin
  } catch (error) {
    console.error('Error creating admin:', error)
    throw error
  }
}

export async function updateUserById(userId: string, updateData: Partial<Admin>) {
  try {
    const updatedAdmin = await AdminModel.findOneAndUpdate(
      { userId },
      updateData,
      { new: true } // Options to return the updated document
    )

    if (!updatedAdmin) {
      console.log('No admin found with the specified ID.')
      return null // Optionally, handle the absence of the user more formally here
    }

    console.log('Updated admin:', updatedAdmin)
    return updatedAdmin
  } catch (error) {
    console.error('Error updating admin:', error)
    throw error
  }
}

export async function deleteAdmin(userId: string) {
  try {
    const deletedAdmin = await AdminModel.findOneAndDelete({ userId })
    if (!deletedAdmin) {
      console.log('No admin found with the specified ID.')
      return null
    }
    console.log('Deleted admin:', deletedAdmin)
    return deletedAdmin
  } catch (error) {
    console.error('Error deleting admin:', error)
    throw error
  }
}
