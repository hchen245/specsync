import * as React from "react"

import { cn } from "@/lib/utils"

interface ExampleWrapperProps {
  children: React.ReactNode
  className?: string
}

interface ExampleProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function ExampleWrapper({ children, className }: ExampleWrapperProps) {
  return <div className={cn("flex w-full flex-col gap-6", className)}>{children}</div>
}

export function Example({ title, children, className }: ExampleProps) {
  return (
    <section className={cn("flex w-full flex-col gap-3", className)}>
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}
