import { format } from 'date-fns'

export function formatDate(date: Date, s = 'dd MMM yyyy'): string {
  return format(date, s)
}
