'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ApiResponse {
  error?: string
}

interface Campaign {
  id: string
  name: string
}

export function AddLeadButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [campaignId, setCampaignId] = useState('')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  
  // Load campaigns when dialog opens
  const handleOpenChange = async (open: boolean) => {
    setOpen(open)
    if (open) {
      try {
        const res = await fetch('/api/campaigns')
        if (res.ok) {
          const data = await res.json() as Campaign[]
          setCampaigns(data)
        }
      } catch (error) {
        console.error('Error loading campaigns:', error)
      }
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          company,
          campaignId: campaignId || null,
          status: 'pending',
        }),
      })
      
      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Lead has been added successfully.',
        })
        setOpen(false)
        resetForm()
        router.refresh()
      } else {
        const data = await res.json() as ApiResponse
        throw new Error(data.error || 'Failed to add lead')
      }
    } catch (error) {
      // Fixed: replaced 'any' type with proper error handling
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }
  
  const resetForm = () => {
    setName('')
    setEmail('')
    setCompany('')
    setCampaignId('')
  }
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="campaign">Campaign</Label>
            <select 
              id="campaign" 
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
            >
              <option value="">-- No Campaign --</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)} 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}