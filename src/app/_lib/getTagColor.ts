const TAG_COLORS = [
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300',
  'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
] as const

export function getTagColor(tag: string): string {
  // Enhanced hash function for better distribution
  let hash = 2166136261 // FNV-1a 32-bit offset basis

  for (let i = 0; i < tag.length; i++) {
    hash ^= tag.charCodeAt(i)
    hash *= 16777619 // FNV-1a 32-bit prime
    hash = hash >>> 0 // Convert to unsigned 32-bit
  }

  // Additional mixing for better distribution
  hash ^= hash >>> 16
  hash *= 0x85ebca6b
  hash ^= hash >>> 13
  hash *= 0xc2b2ae35
  hash ^= hash >>> 16

  const index = Math.abs(hash) % TAG_COLORS.length
  return TAG_COLORS[index]
}
