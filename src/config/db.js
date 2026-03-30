const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const ssl =
  process.env.DB_SSL === 'true' ||
  (process.env.DATABASE_URL &&
    (process.env.DATABASE_URL.includes('neon.tech') ||
      /sslmode=require|sslmode=verify-full/i.test(process.env.DATABASE_URL)))
    ? { rejectUnauthorized: true }
    : undefined;

const poolConfig = {
  max: parseInt(process.env.DB_POOL_MAX) || 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ...(ssl ? { ssl } : {}),
      ...poolConfig,
    })
  : new Pool({
      host:     process.env.DB_HOST,
      port:     Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ...(ssl ? { ssl } : {}),
      ...poolConfig,
    });

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
});

module.exports = pool;
