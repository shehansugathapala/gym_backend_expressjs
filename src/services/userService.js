const pool = require('../config/db');

const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
  return result.rows;
};

const createUser = async (user) => {
  const { name, email, age } = user;

  const result = await pool.query(
    'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
    [name, email, age]
  );

  return result.rows[0];
};

module.exports = {
  getAllUsers,
  createUser,
};