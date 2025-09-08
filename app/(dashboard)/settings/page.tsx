'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'

interface UserSession {
  user?: {
    name?: string
    email?: string
    image?: string
  }
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  const userSession = session as UserSession | null
  
  useEffect(() => {
    if (userSession?.user) {
      setName(userSession.user.name || '')
      setImage(userSession.user.image || '')
    }
  }, [userSession])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          setName(data.name || '')
          setImage(data.image || '')
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    
    fetchSettings()
  }, [])
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, image }),
      })
      
      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Your profile has been updated.',
        })
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile}>
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={image || undefined} />
                      <AvatarFallback>
                        {name?.charAt(0) || userSession?.user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userSession?.user?.email}</p>
                      <p className="text-sm text-gray-500">Update your photo by setting a URL</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input 
                        id="avatar" 
                        value={image} 
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>
                  Manage your email preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      value={userSession?.user?.email || ''} 
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      To change your email, please contact support.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Notification settings will be available in future updates.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Appearance settings will be available in future updates.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Security settings will be available in future updates.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}