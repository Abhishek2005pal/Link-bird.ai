'use client'

import { useEffect, useState } from "react"

interface ToastEvent {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

interface Toast extends ToastEvent {
  id: string
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])
  
  // Global event listener for toast messages
  useEffect(() => {
    const handleToast = (event: CustomEvent<ToastEvent>) => {
      const { title, description, variant, duration = 5000 } = event.detail
      const id = Math.random().toString(36).substring(2, 9)
      
      setToasts(prev => [...prev, { id, title, description, variant, duration }])
      
      // Auto dismiss after duration
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
      }, duration)
    }
    
    // Add event listener
    window.addEventListener('toast', handleToast as EventListener)
    
    // Cleanup
    return () => {
      window.removeEventListener('toast', handleToast as EventListener)
    }
  }, [])
  
  if (toasts.length === 0) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`rounded-md border bg-white p-4 shadow-md animate-in fade-in slide-in-from-right-5 ${
            toast.variant === 'destructive' ? 'border-red-500 bg-red-50' : 'border-gray-200'
          }`}
        >
          {toast.title && (
            <div className="font-medium">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm text-gray-500">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  )
}