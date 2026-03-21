const pool = require('../config/db');

const createPlan = async ({ name, description, price, duration_days }) => {
  const result = await pool.query(
    `INSERT INTO plans (name, description, price, duration_days)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description, price, duration_days]
  );

  return result.rows[0];
};

const getPlans = async () => {
  const result = await pool.query('SELECT * FROM plans ORDER BY id DESC');
  return result.rows;
};

module.exports = {
  createPlan,
  getPlans,
};