require('dotenv').config()
const { createClient } = require('@libsql/client')

async function seedDatabase() {
  try {
    console.log('Connecting to database...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'Missing')
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables')
    }
    
    const client = createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN
    })

    console.log('Seeding campaigns...')
    
    // Insert campaigns
    await client.execute({
      sql: `INSERT INTO campaigns (id, name, status, total_leads, successful_leads, response_rate, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ['campaign-1', 'Q1 Email Campaign', 'active', 150, 45, 30, Date.now()]
    })
    
    await client.execute({
      sql: `INSERT INTO campaigns (id, name, status, total_leads, successful_leads, response_rate, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      args: ['campaign-2', 'Product Launch', 'paused', 200, 80, 40, Date.now()]
    })

    console.log('Seeding leads...')
    
    // Insert leads
    await client.execute({
      sql: `INSERT INTO leads (id, name, email, company, campaign_id, status, last_contact_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ['lead-1', 'John Doe', 'john@techcorp.com', 'Tech Corp', 'campaign-1', 'pending', Date.now(), Date.now()]
    })
    
    await client.execute({
      sql: `INSERT INTO leads (id, name, email, company, campaign_id, status, last_contact_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ['lead-2', 'Jane Smith', 'jane@startup.io', 'Startup Inc', 'campaign-1', 'contacted', Date.now(), Date.now()]
    })

    console.log('Database seeded successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()