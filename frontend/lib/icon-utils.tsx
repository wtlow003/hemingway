import {
  Braces,
  FileText,
  Code2,
  Terminal,
  Blocks,
  FileCode,
  Zap,
} from "lucide-react"

const iconMap = {
  Braces,
  FileText,
  Code2,
  Terminal,
  Blocks,
  FileCode,
  Zap,
}

export const getIcon = (iconName: string, className?: string) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap]
  if (!IconComponent) return null
  return <IconComponent className={className} />
}
