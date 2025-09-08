import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, sessions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// Helper to get the current user ID from session cookie
async function getCurrentUserId(request: NextRequest): Promise<string | null> {
  try {
    // Look for the session cookie with various possible names
    let sessionCookie = request.cookies.get('auth_session')?.value
    
    if (!sessionCookie) {
      sessionCookie = request.cookies.get('better_auth_session')?.value
    }
    
    if (!sessionCookie) {
      // Log all available cookies for debugging
      console.log("Available cookies:", [...request.cookies.getAll()].map(c => c.name))
      console.log("No session cookie found")
      return null
    }
    
    console.log("Found session cookie:", sessionCookie.substring(0, 10) + '...')
    
    // Find session in database
    const session = await db.select({
      userId: sessions.userId
    })
    .from(sessions)
    .where(eq(sessions.token, sessionCookie))
    .limit(1)
    
    if (!session.length) {
      console.log("No valid session found")
      return null
    }
    
    return session[0].userId
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request)
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
    const userId = await getCurrentUserId(request)
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

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