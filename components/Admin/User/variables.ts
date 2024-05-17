import { AdminRole } from '@/types/db'

export function getRoleLabel(role: number) {
  switch (role) {
    case AdminRole.SuperAdmin:
      return 'Super Admin'
    case AdminRole.DevAdmin:
      return 'Dev Admin'
    default:
      return 'Unknown'
  }
}

export const labelData = [
  { value: `${AdminRole.SuperAdmin}`, label: getRoleLabel(AdminRole.SuperAdmin) },
  { value: `${AdminRole.DevAdmin}`, label: getRoleLabel(AdminRole.DevAdmin) },
] as const
