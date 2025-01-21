import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex justify-between items-center mb-4", className)}>
      <h2 className="text-lg font-medium">{title}</h2>
      {children && <div className="flex items-center">{children}</div>}
    </div>
  )
} 