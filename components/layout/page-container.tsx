interface PageContainerProps {
  children: React.ReactNode
  heading?: string
  subheading?: string
  className?: string
}

export function PageContainer({
  children,
  heading,
  subheading,
  className = ""
}: PageContainerProps) {
  return (
    <div className="py-8 px-4 md:py-16 md:px-0 space-y-6 md:space-y-8">
      {(heading || subheading) && (
        <div className="text-center space-y-3 md:space-y-4">
          {heading && (
            <h1 className="text-3xl md:text-4xl font-bold">{heading}</h1>
          )}
          {subheading && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>
      )}
      <div className={className}>{children}</div>
    </div>
  )
} 