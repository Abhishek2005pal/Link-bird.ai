'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  selectedTab: string
  setSelectedTab: (id: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a TabsProvider')
  }
  return context
}

export function Tabs({ 
  defaultValue, 
  value, 
  onValueChange, 
  className, 
  children 
}: { 
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode 
}) {
  const [selectedTab, setSelectedTab] = React.useState(defaultValue || value || '')
  
  React.useEffect(() => {
    if (value) {
      setSelectedTab(value)
    }
  }, [value])
  
  const handleTabChange = React.useCallback((id: string) => {
    setSelectedTab(id)
    onValueChange?.(id)
  }, [onValueChange])
  
  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab: handleTabChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn('flex space-x-1 rounded-lg bg-gray-100 p-1', className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ 
  value, 
  className, 
  children 
}: { 
  value: string
  className?: string
  children: React.ReactNode 
}) {
  const { selectedTab, setSelectedTab } = useTabs()
  const isActive = selectedTab === value
  
  return (
    <button
      className={cn(
        'px-3 py-1.5 text-sm font-medium transition-all',
        'rounded-md',
        isActive 
          ? 'bg-white shadow text-black' 
          : 'text-gray-600 hover:text-black',
        className
      )}
      onClick={() => setSelectedTab(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ 
  value, 
  className, 
  children 
}: { 
  value: string
  className?: string
  children: React.ReactNode 
}) {
  const { selectedTab } = useTabs()
  
  if (selectedTab !== value) {
    return null
  }
  
  return (
    <div className={cn('mt-2', className)}>
      {children}
    </div>
  )
}
