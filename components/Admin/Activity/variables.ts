export function createSlug(text: string): string {
  return text
    .toLowerCase() // 转换为小写
    .trim() // 去除首尾空格
    .replace(/[^a-z0-9 -]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 将空格替换为连字符
    .replace(/-+/g, '-') // 移除多余的连字符
}
