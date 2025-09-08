// Simplified toast hook
import { type ReactNode } from "react"

type ToastProps = {
  title?: string
  description?: ReactNode | string
  action?: ReactNode
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = (props: ToastProps) => {
    // Dispatch a custom event that our Toaster component will listen for
    const event = new CustomEvent('toast', {
      detail: props
    })
    
    window.dispatchEvent(event)
  }

  return { toast }
}
