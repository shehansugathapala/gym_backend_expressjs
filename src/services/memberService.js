const pool = require('../config/db');
const ApiError = require('../utils/ApiError');
const loadSql = require('../utils/loadSql');

const Q = loadSql('members.sql');

const getMembers = async () => {
  const result = await pool.query(Q.getAll);
  return result.rows;
};

const getMemberById = async (id) => {
  const result = await pool.query(Q.getById, [id]);
  if (result.rows.length === 0) throw new ApiError(404, 'Member not found');
  return result.rows[0];
};

const updateMember = async (id, fields) => {
  const existing = await pool.query(Q.checkExists, [id]);
  if (existing.rows.length === 0) throw new ApiError(404, 'Member not found');

  const { phone, gender, date_of_birth, address, emergency_contact, profile_image_url, full_name, status } = fields;
  const userId = existing.rows[0].user_id;

  if (full_name !== undefined || status !== undefined) {
    await pool.query(
      'UPDATE users SET full_name = COALESCE($1, full_name), status = COALESCE($2, status) WHERE id = $3',
      [full_name ?? null, status ?? null, userId]
    );
  }

  const result = await pool.query(Q.updateProfile, [
    phone, gender, date_of_birth, address, emergency_contact, profile_image_url, id,
  ]);
  return result.rows[0];
};

const deleteMember = async (id) => {
  const existing = await pool.query(Q.checkExists, [id]);
  if (existing.rows.length === 0) throw new ApiError(404, 'Member not found');
  await pool.query(Q.deleteByUserId, [existing.rows[0].user_id]);
};

module.exports = { getMembers, getMemberById, updateMember, deleteMember };
