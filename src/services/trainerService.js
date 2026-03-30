const pool = require('../config/db');
const ApiError = require('../utils/ApiError');
const loadSql = require('../utils/loadSql');

const Q = loadSql('trainers.sql');

const getTrainers = async () => {
  const result = await pool.query(Q.getAll);
  return result.rows;
};

const getTrainerById = async (id) => {
  const result = await pool.query(Q.getById, [id]);
  if (result.rows.length === 0) throw new ApiError(404, 'Trainer not found');
  return result.rows[0];
};

const updateTrainer = async (id, fields) => {
  const existing = await pool.query(Q.checkExists, [id]);
  if (existing.rows.length === 0) throw new ApiError(404, 'Trainer not found');

  const { specialization, bio, hire_date, full_name, status } = fields;
  const userId = existing.rows[0].user_id;

  if (full_name || status) {
    const updates = [];
    const values = [];
    let idx = 1;
    if (full_name) { updates.push(`full_name = $${idx++}`); values.push(full_name); }
    if (status)    { updates.push(`status = $${idx++}`);    values.push(status); }
    values.push(userId);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${idx}`, values);
  }

  const result = await pool.query(Q.updateProfile, [specialization, bio, hire_date, id]);
  return result.rows[0];
};

const deleteTrainer = async (id) => {
  const existing = await pool.query(Q.checkExists, [id]);
  if (existing.rows.length === 0) throw new ApiError(404, 'Trainer not found');
  await pool.query(Q.deleteByUserId, [existing.rows[0].user_id]);
};

module.exports = { getTrainers, getTrainerById, updateTrainer, deleteTrainer };
