'use client'

import { AddCampaignButton } from '@/components/campaigns/add-campaign-button'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { Pause, Play, Trash2 } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  status: string
  totalLeads: number
  successfulLeads: number
  responseRate: number
  createdAt: Date
}

async function fetchCampaigns(): Promise<Campaign[]> {
  const response = await fetch('/api/campaigns')
  if (!response.ok) {
    throw new Error('Failed to fetch campaigns')
  }
  return response.json()
}

export default function CampaignsPage() {
  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading campaigns...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Error loading campaigns</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Campaigns</h1>
          
          <AddCampaignButton />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Leads</TableHead>
              <TableHead>Successful</TableHead>
              <TableHead>Response Rate</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </TableCell>
                <TableCell>{campaign.totalLeads}</TableCell>
                <TableCell>{campaign.successfulLeads}</TableCell>
                <TableCell>{campaign.responseRate}%</TableCell>
                <TableCell>
                  <Progress 
                    value={campaign.responseRate} 
                    className="w-16" 
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      {campaign.status === 'active' ? 
                        <Pause className="h-4 w-4" /> : 
                        <Play className="h-4 w-4" />
                      }
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {campaigns.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No campaigns found
          </div>
        )}
      </div>
    </div>
  )
}