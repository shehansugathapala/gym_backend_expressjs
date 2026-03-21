const pool = require('../config/db');
const ApiError = require('../utils/ApiError');

const getMembers = async () => {
  const result = await pool.query(`
    SELECT 
      m.id,
      u.full_name,
      u.email,
      u.status,
      m.phone,
      m.gender,
      m.joined_date
    FROM members m
    JOIN users u ON u.id = m.user_id
    ORDER BY m.id DESC
  `);

  return result.rows;
};

const getMemberById = async (id) => {
  const result = await pool.query(`
    SELECT 
      m.*,
      u.full_name,
      u.email,
      u.role,
      u.status
    FROM members m
    JOIN users u ON u.id = m.user_id
    WHERE m.id = $1
  `, [id]);

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Member not found');
  }

  return result.rows[0];
};

module.exports = {
  getMembers,
  getMemberById,
};