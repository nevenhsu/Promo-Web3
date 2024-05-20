import axios from 'axios'
import type { TAdmin } from '@/models/admin'

const api = '/api/private/admin'

export const createAdmin = async (username: string, role: number): Promise<TAdmin | undefined> => {
  try {
    const { data } = await axios.post<{ admin: TAdmin }>(`${api}/create/${username}`, {
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
    const { data } = await axios.put<{ admin: TAdmin }>(`${api}/update/${userId}`, updateData)
    return data.admin
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const deleteAdmin = async (userId: string): Promise<TAdmin | undefined> => {
  try {
    const { data } = await axios.delete<{ admin: TAdmin }>(`${api}/delete/${userId}`)
    return data.admin
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export const getAllAdmins = async (): Promise<TAdmin[] | undefined> => {
  try {
    const { data } = await axios.get<{ admins: TAdmin[] }>(api)
    return data.admins
  } catch (err) {
    console.error(err)
    return undefined
  }
}
