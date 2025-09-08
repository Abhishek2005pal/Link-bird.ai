import { createClient } from '@libsql/client'
import { createId } from '@paralleldrive/cuid2'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { campaigns, leads } from './db/schema'

console.log('Environment check:')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'Missing')
console.log('DATABASE_AUTH_TOKEN:', process.env.DATABASE_AUTH_TOKEN ? 'Found' : 'Missing')

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing from environment')
  process.exit(1)
}

if (!process.env.DATABASE_AUTH_TOKEN) {
  console.error('DATABASE_AUTH_TOKEN is missing from environment')
  process.exit(1)
}

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
})

const db = drizzle(client, { 
  schema: { campaigns, leads } 
})

async function seedDatabase() {
  try {
    console.log('Starting database seed...')
    
    // Test connection first
    console.log('Testing database connection...')
    await client.execute('SELECT 1')
    console.log('Database connection successful')
    
    // Clear existing data
    console.log('Clearing existing data...')
    await db.delete(leads)
    await db.delete(campaigns)
    
    // Insert sample campaigns
    console.log('Inserting campaigns...')
    const sampleCampaigns = [
      {
        id: createId(),
        name: 'Q1 Email Campaign',
        status: 'active',
        totalLeads: 150,
        successfulLeads: 45,
        responseRate: 30.0,
      },
      {
        id: createId(),
        name: 'Product Launch',
        status: 'paused',
        totalLeads: 200,
        successfulLeads: 80,
        responseRate: 40.0,
      },
      {
        id: createId(),
        name: 'Summer Sale Campaign',
        status: 'completed',
        totalLeads: 300,
        successfulLeads: 120,
        responseRate: 40.0,
      }
    ]

    await db.insert(campaigns).values(sampleCampaigns)
    console.log(`Inserted ${sampleCampaigns.length} campaigns`)

    // Get campaign IDs
    const allCampaigns = await db.select().from(campaigns)
    const campaignIds = allCampaigns.map(c => c.id)
    
    // Insert sample leads
    console.log('Inserting leads...')
    const sampleLeads = [
      {
        id: createId(),
        name: 'John Doe',
        email: 'john@techcorp.com',
        company: 'Tech Corp',
        campaignId: campaignIds[0],
        status: 'pending',
        lastContactDate: new Date(),
      },
      {
        id: createId(),
        name: 'Jane Smith',
        email: 'jane@startup.io',
        company: 'Startup Inc',
        campaignId: campaignIds[0],
        status: 'contacted',
        lastContactDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: createId(),
        name: 'Bob Wilson',
        email: 'bob@enterprise.com',
        company: 'Enterprise Ltd',
        campaignId: campaignIds[1],
        status: 'responded',
        lastContactDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
      {
        id: createId(),
        name: 'Alice Johnson',
        email: 'alice@company.net',
        company: 'Company Net',
        campaignId: campaignIds[1],
        status: 'converted',
        lastContactDate: new Date(Date.now() - 72 * 60 * 60 * 1000),
      },
      {
        id: createId(),
        name: 'Mike Brown',
        email: 'mike@business.co',
        company: 'Business Co',
        campaignId: campaignIds[2],
        status: 'pending',
        lastContactDate: new Date(),
      }
    ]

    await db.insert(leads).values(sampleLeads)
    console.log(`Inserted ${sampleLeads.length} leads`)

    // Verify the data
    const totalCampaigns = await db.select().from(campaigns)
    const totalLeads = await db.select().from(leads)
    
    console.log('\nSeed Summary:')
    console.log(`Campaigns: ${totalCampaigns.length}`)
    console.log(`Leads: ${totalLeads.length}`)
    console.log('Database seeded successfully!')
    
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    client.close()
  }
}

// Run the seed
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
}