import { db } from '@/lib/db'
import { campaigns } from '@/lib/db/schema'
import { NextRequest } from 'next/server'

export async function GET() {
  const result = await db.select().from(campaigns)
  return Response.json(result)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return Response.json({ error: 'Campaign name is required' }, { status: 400 })
    }
    
    // Insert new campaign
    const result = await db.insert(campaigns).values({
      name: body.name,
      status: body.status || 'draft',
      totalLeads: 0,
      successfulLeads: 0,
      responseRate: 0,
      createdAt: new Date(),
    }).returning()
    
    return Response.json(result[0])
  } catch (error) {
    console.error('Error creating campaign:', error)
    return Response.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}