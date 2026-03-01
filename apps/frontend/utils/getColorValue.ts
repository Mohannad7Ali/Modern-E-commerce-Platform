// Color mapping for common colors
const getColorValue = (colorName: string) => {
  const colorMap: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899',
    orange: '#f97316',
    brown: '#a16207',
    black: '#000000',
    white: '#ffffff',
    gray: '#6b7280',
    grey: '#6b7280',
    navy: '#1e3a8a',
    maroon: '#991b1b',
    teal: '#0d9488',
    lime: '#84cc16',
    indigo: '#6366f1',
    cyan: '#06b6d4',
    amber: '#f59e0b',
    emerald: '#10b981',
    rose: '#f43f5e',
    violet: '#8b5cf6',
    sky: '#0ea5e9',
    slate: '#64748b',
    zinc: '#71717a',
    neutral: '#737373',
    stone: '#78716c',
  }
  return colorMap[colorName.toLowerCase()] || '#6b7280'
}
export default getColorValue
