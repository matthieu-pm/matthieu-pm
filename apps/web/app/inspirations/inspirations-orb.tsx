import { Shdr29 } from "@workspace/ui/components/shdr-29"

export function InspirationsOrb({
  size = 96,
  className,
}: {
  size?: number
  className?: string
}) {
  return <Shdr29 size={size} className={className} state="idle" />
}
