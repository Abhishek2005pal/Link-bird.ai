'use client'

import { Button } from '@/components/ui/button'
import { signOut, useSession } from '@/lib/auth-client'
import { useAppStore } from '@/lib/store'
import { LogOut, Menu, Settings, Target, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Campaigns', href: '/campaigns', icon: Target },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30 flex flex-col ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header section with toggle */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout button at bottom */}
      {session && (
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className={`w-full transition-colors hover:bg-red-50 hover:text-red-600 ${
              sidebarCollapsed ? 'justify-center px-2' : 'justify-start'
            }`}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      )}
    </div>
  )
}