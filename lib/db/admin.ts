import * as _ from 'lodash-es'
import mongoose from 'mongoose'
import AdminModel, { type Admin } from '@/models/admin'
import type { TUser } from '@/models/user'

export async function createAdmin(_user: string, role: number) {
  try {
    const admin = new AdminModel({ _user, role })
    await admin.save()
    console.log('Admin created:', admin)

    const newAdmin = await admin.populate<{ _user: TUser }>('_user')
    return newAdmin
  } catch (error) {
    console.error('Error creating admin:', error)
    throw error
  }
}

export async function updateAdmin(_user: string, updateData: Partial<Admin>) {
  try {
    const updatedAdmin = await AdminModel.findOneAndUpdate(
      { _user },
      updateData,
      { new: true } // Options to return the updated document
    )

    if (!updatedAdmin) {
      console.log('No admin found with the specified ID.')
      return null
    }

    console.log('Updated admin:', updatedAdmin)

    const updated = await updatedAdmin.populate<{ _user: TUser }>('_user')
    return updated
  } catch (error) {
    console.error('Error updating admin:', error)
    throw error
  }
}

export async function deleteAdmin(_user: string) {
  try {
    const deletedAdmin = await AdminModel.findOneAndDelete({ _user })
    if (!deletedAdmin) {
      console.log('No admin found with the specified ID.')
      return null
    }
    console.log('Deleted admin:', deletedAdmin)
    const deleted = await deletedAdmin.populate<{ _user: TUser }>('_user')
    return deleted
  } catch (error) {
    console.error('Error deleting admin:', error)
    throw error
  }
}

export async function getAllAdmins() {
  try {
    const admins = await AdminModel.find().populate<{ _user: TUser }>('_user')
    console.log('All admins:', admins.length)
    return admins
  } catch (error) {
    console.error('Error fetching admins:', error)
    throw error
  }
}

export async function getAdmin(userId: string) {
  try {
    const admin = await AdminModel.findOne({ _user: userId, active: true }).orFail()
    return admin
  } catch (error) {
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      // No admin found with the specified ID
    } else {
      console.error('Error fetching admin:', error)
    }
    return null
  }
}
