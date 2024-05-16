import { AdminRole } from '@/types/db'

export function getRoleLabel(role: number) {
  switch (role) {
    case AdminRole.SuperAdmin:
      return 'Super Admin'
    case AdminRole.UserAdmin:
      return 'User Admin'
    default:
      return 'Unknown'
  }
}

export const labelData = [
  { value: `${AdminRole.SuperAdmin}`, label: getRoleLabel(AdminRole.SuperAdmin) },
  { value: `${AdminRole.UserAdmin}`, label: getRoleLabel(AdminRole.UserAdmin) },
] as const
