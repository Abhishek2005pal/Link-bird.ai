'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn, signUp } from '@/lib/auth-client'
import { useState } from 'react'

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    
    try {
      if (isLogin) {
        await signIn.email({ email, password })
      } else {
        // Add validation for password
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long')
        }
        
        await signUp.email({ email, password, name })
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Auth error:', error)
      // Extract error message - replaced 'any' type with proper error handling
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed. Please check your details and try again.'
      setErrorMsg(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      await signIn.social({ provider: 'google' })
    } catch (error) {
      console.error('Google auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isLogin ? 'Sign In' : 'Sign Up'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {errorMsg && (
            <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded">
              {errorMsg}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleAuth}
          className="w-full"
          disabled={loading}
        >
          Continue with Google
        </Button>
        
        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}