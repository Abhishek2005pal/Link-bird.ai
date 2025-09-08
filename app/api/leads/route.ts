import { db } from '@/lib/db'
import { campaigns, leads } from '@/lib/db/schema'
import { and, eq, like } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export interface LeadResponse {
  id: string
  name: string
  email: string
  company: string | null
  status: string
  lastContactDate: Date | null
  campaignName: string | null
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    // Build conditions array first
    const conditions = []
    
    if (search) {
      conditions.push(like(leads.name, `%${search}%`))
    }
    
    if (status !== 'all') {
      conditions.push(eq(leads.status, status))
    }

    // Build the query with conditional where clause
    const baseQuery = db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        company: leads.company,
        status: leads.status,
        lastContactDate: leads.lastContactDate,
        campaignName: campaigns.name,
      })
      .from(leads)
      .leftJoin(campaigns, eq(leads.campaignId, campaigns.id))

    // Apply where conditions if any exist, otherwise use base query
    const query = conditions.length > 0 
      ? baseQuery.where(and(...conditions))
      : baseQuery

    // Apply pagination and execute
    const result = await query
      .limit(limit)
      .offset((page - 1) * limit)

    return Response.json(result)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return Response.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 })
    }
    
    // Insert new lead
    const result = await db.insert(leads).values({
      name: body.name,
      email: body.email,
      company: body.company || null,
      campaignId: body.campaignId || null,
      status: body.status || 'pending',
      lastContactDate: body.lastContactDate ? new Date(body.lastContactDate) : null,
      createdAt: new Date(),
    }).returning()
    
    return Response.json(result[0])
  } catch (error) {
    console.error('Error creating lead:', error)
    return Response.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}