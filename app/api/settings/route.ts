import { getSession } from '@/lib/auth-client'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const sessionResult = await getSession()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = (sessionResult as unknown) as any
    
    if (!session?.user?.id && !session?.data?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Handle both possible structures
    const userId = session?.user?.id || session?.data?.user?.id

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    // Return only the fields that are safe to expose to the client
    return Response.json({
      name: user.name,
      email: user.email,
      image: user.image,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionResult = await getSession()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = (sessionResult as unknown) as any
    
    if (!session?.user?.id && !session?.data?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Handle both possible structures
    const userId = session?.user?.id || session?.data?.user?.id

    const data = await request.json()
    
    // Validate required fields
    if (!data.name && !data.image) {
      return Response.json({ error: 'Name or image is required' }, { status: 400 })
    }

    // Update user profile
    const result = await db
      .update(users)
      .set({
        name: data.name,
        image: data.image,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({ id: users.id })

    if (!result.length) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return Response.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}