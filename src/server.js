require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL Connected');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`\n${signal} received — shutting down gracefully`);
      server.close(async () => {
        await pool.end();
        console.log('PostgreSQL pool closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ DB Connection Error:', error.message);
    process.exit(1);
  }
};

startServer();
