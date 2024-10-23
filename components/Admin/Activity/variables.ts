export function createSlug(str: string): string {
  return str
    .trim() // Remove leading/trailing spaces
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-一-龥]/g, '') // Remove non-word characters except Chinese characters and hyphens
    .toLowerCase() // Optional: Convert to lowercase for consistency
}
