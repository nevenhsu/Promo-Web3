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

export const labelData = [
  { value: `${Admin.SuperAdmin}`, label: getRoleLabel(Admin.SuperAdmin) },
  { value: `${Admin.UserAdmin}`, label: getRoleLabel(Admin.UserAdmin) },
] as const
