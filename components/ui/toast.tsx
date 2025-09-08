import { cn } from "@/lib/utils"
import * as React from "react"

// Simple component definitions without Radix UI dependency
export type ToastProps = {
  variant?: "default" | "destructive"
  title?: string
  description?: React.ReactNode
  action?: React.ReactNode
}

// Simple Toast component without Radix UI dependency
const Toast: React.FC<ToastProps & React.HTMLAttributes<HTMLDivElement>> = ({
  className, 
  variant = "default", 
  title,
  description,
  action,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-between rounded-md border p-4 shadow-lg",
        variant === "destructive" && "border-red-500 bg-red-50 text-red-600",
        variant === "default" && "border-gray-200 bg-white text-gray-950",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1">
        {title && <ToastTitle>{title}</ToastTitle>}
        {description && <ToastDescription>{description}</ToastDescription>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

const ToastTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  ...props 
}) => (
  <div
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
)

const ToastDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  ...props 
}) => (
  <div
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
)

const ToastAction: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ 
  className, 
  ...props 
}) => (
  <button
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-transparent px-3 text-sm font-medium hover:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
)

export type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
    Toast, ToastAction, ToastDescription, ToastTitle
}

