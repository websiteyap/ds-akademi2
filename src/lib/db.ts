import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

// PostgreSQL connection pool — uses DATABASE_URL env variable
const pool = new Pool({
  connectionString,
  // Disable SSL for localhost, enable it for hosted DBs (like Supabase, AWS RDS, Dokploy if configured)
  ssl: connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export { pool as db };
