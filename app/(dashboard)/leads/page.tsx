'use client'

import { AddLeadButton } from '@/components/leads/add-lead-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAppStore } from '@/lib/store'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'

export interface Lead {
  id: string
  name: string
  email: string
  company: string | null
  status: string
  lastContactDate: Date | null
  campaignName: string | null
}

interface FetchLeadsParams {
  pageParam?: number
  search?: string
  status?: string
}

async function fetchLeads({ pageParam = 1, search = '', status = 'all' }: FetchLeadsParams): Promise<Lead[]> {
  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: '20',
    search,
    status,
  })
  
  const response = await fetch(`/api/leads?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch leads')
  }
  return response.json()
}

export default function LeadsPage() {
  const { selectedLead, setSelectedLead, searchQuery, setSearchQuery, selectedStatus, setSelectedStatus } = useAppStore()
  const [selectedLeadData, setSelectedLeadData] = useState<Lead | null>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['leads', searchQuery, selectedStatus],
    queryFn: ({ pageParam = 1 }) => fetchLeads({ 
      pageParam: pageParam as number, 
      search: searchQuery, 
      status: selectedStatus 
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined
    },
  })

  const leads = data?.pages.flat() || []

  const handleLeadClick = (lead: Lead) => {
    setSelectedLeadData(lead)
    setSelectedLead(lead.id)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted':
        return 'bg-green-100 text-green-800'
      case 'responded':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading leads...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Leads</h1>
          
          <AddLeadButton />
        </div>
        
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="responded">Responded</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleLeadClick(lead)}
              >
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.company || '-'}</TableCell>
                <TableCell>{lead.campaignName || '-'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </TableCell>
                <TableCell>{formatDate(lead.lastContactDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {hasNextPage && (
          <div className="p-4 text-center">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
        
        {leads.length === 0 && !isLoading && (
          <div className="p-8 text-center text-gray-500">
            No leads found
          </div>
        )}
      </div>

      <Sheet open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Lead Details</SheetTitle>
          </SheetHeader>
          
          {selectedLeadData && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg font-semibold">{selectedLeadData.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-base">{selectedLeadData.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Company</label>
                <p className="text-base">{selectedLeadData.company || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-base">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedLeadData.status)}`}>
                    {selectedLeadData.status}
                  </span>
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Campaign</label>
                <p className="text-base">{selectedLeadData.campaignName || 'Not assigned'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Last Contact</label>
                <p className="text-base">{formatDate(selectedLeadData.lastContactDate)}</p>
              </div>
              
              <div className="pt-6 space-y-2">
                <Button className="w-full">Contact Lead</Button>
                <Button variant="outline" className="w-full">Update Status</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}