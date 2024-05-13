import { Admin } from '@/types/db'

export function getRoleLabel(role: number) {
  switch (role) {
    case Admin.SuperAdmin:
      return 'Super Admin'
    case Admin.UserAdmin:
      return 'User Admin'
    default:
      return 'Unknown'
  }
}
