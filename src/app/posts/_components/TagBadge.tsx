import { Badge } from '@/app/_components/ui/badge'
import { getTagColor } from '@/app/_lib/getTagColor'

export function TagBadge({ tag }: { tag: string }) {
  const color = getTagColor(tag)

  return (
    <Badge
      variant="secondary"
      className={`text-xs ${color} hover:opacity-80 transition-opacity`}
    >
      #{tag}
    </Badge>
  )
}
