import type { ColorData } from '@/types/color'

export function toRGBA(color: ColorData) {
  return `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
}
