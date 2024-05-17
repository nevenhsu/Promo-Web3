import axios from 'axios'
import type { TAdmin } from '@/models/admin'

export const createAdmin = async (username: string, role: number): Promise<TAdmin | undefined> => {
  try {
    const { data } = await axios.post<{ admin: TAdmin }>(`/api/private/admin/create/${username}`, {
      role,
    })
    return data.admin
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const updateAdmin = async (
  userId: string,
  updateData: Partial<TAdmin>
): Promise<TAdmin | undefined> => {
  try {
    const { data } = await axios.put<{ admin: TAdmin }>(
      `/api/private/admin/update/${userId}`,
      updateData
    )
    return data.admin
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const deleteAdmin = async (userId: string): Promise<TAdmin | undefined> => {
  try {
    const { data } = await axios.delete<{ admin: TAdmin }>(`/api/private/admin/delete/${userId}`)
    return data.admin
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const getAllAdmins = async (): Promise<TAdmin[] | undefined> => {
  try {
    const { data } = await axios.get<{ admins: TAdmin[] }>(`/api/private/admin`)
    return data.admins
  } catch (err) {
    console.error(err)
    return undefined
  }
}
