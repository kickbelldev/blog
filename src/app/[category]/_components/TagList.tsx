import { TagBadge } from './TagBadge'

export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagBadge
          key={tag}
          tag={tag}
        />
      ))}
    </div>
  )
}
