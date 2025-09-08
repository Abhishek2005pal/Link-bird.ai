'use client'

import { AuthDialog } from '@/components/auth/auth-dialog'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { Sidebar } from '@/components/layout/sidebar'
import { useSession } from '@/lib/auth-client'
import { useAppStore } from '@/lib/store'
import { useEffect, useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, isPending } = useSession()
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const { sidebarCollapsed } = useAppStore()

  useEffect(() => {
    if (!isPending && !session) {
      setShowAuthDialog(true)
    }
  }, [session, isPending])

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}