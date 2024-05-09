type ColorData = {
  rgb: { r: number; g: number; b: number; a: number }
}

export function toRGBA(color: ColorData) {
  return `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
}
