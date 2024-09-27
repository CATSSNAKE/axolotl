const { Pool } = require('pg'); // Use require('pg') if using CommonJS

const PG_URI =
  process.env.DATABASE_URI ||
  'postgresql://postgres.qjdawteymmlljerttghu:outdoor12buddies34@aws-0-us-west-1.pooler.supabase.com:6543/postgres'; // Update with your connection string

const pool = new Pool({
  connectionString: PG_URI,
});

// Test connection function
const testConnection = async () => {
  try {
    const client = await pool.connect(); // Connect to the database
    console.log('Connected to the database successfully!');

    const res = await client.query('SELECT NOW()'); // Basic query to get current timestamp
    console.log('Current timestamp:', res.rows[0]);

    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await pool.end(); // Close the pool
  }
};

// Call the test connection function
testConnection();
