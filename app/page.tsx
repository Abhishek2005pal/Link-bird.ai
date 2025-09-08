'use client'

import { AuthDialog } from '@/components/auth/auth-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from '@/lib/auth-client'
import { Mail, Target, TrendingUp, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomePage() {
  const { data: session, isPending } = useSession()
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const router = useRouter()

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">Linkbird.ai</h1>
              </div>
            </div>
            <div>
              {session ? (
                <Button 
                  onClick={() => router.push('/leads')}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={() => setShowAuthDialog(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            {session ? `Welcome back, ${session.user?.name?.split(' ')[0] || 'User'}!` : 'Manage Your'}{' '}
            {!session && <span className="text-indigo-600">Leads & Campaigns</span>}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {session 
              ? "Ready to continue managing your leads and campaigns? Access your dashboard to track, manage, and convert leads efficiently."
              : "Streamline your lead generation and campaign management with our powerful platform. Track, manage, and convert leads efficiently."
            }
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {session ? (
              <Button 
                size="lg"
                onClick={() => router.push('/leads')}
                className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button 
                size="lg"
                onClick={() => setShowAuthDialog(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3"
              >
                Start Free Trial
              </Button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Lead Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Organize and track all your leads in one centralized dashboard
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Campaign Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor campaign performance with real-time analytics and insights
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get detailed reports on conversion rates and campaign success
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automate your outreach and follow-up processes for better efficiency
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">10,000+</div>
              <div className="text-sm text-gray-500">Leads Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">85%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-sm text-gray-500">Active Campaigns</div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Dialog - Only show if not logged in */}
      {!session && (
        <AuthDialog 
          open={showAuthDialog} 
          onOpenChange={setShowAuthDialog}
        />
      )}
    </div>
  )
}