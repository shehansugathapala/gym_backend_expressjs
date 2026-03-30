const pool = require('../config/db');
const ApiError = require('../utils/ApiError');
const loadSql = require('../utils/loadSql');

const Q = loadSql('plans.sql');

const createPlan = async ({ name, description, price, duration_days }) => {
  const result = await pool.query(Q.insert, [name, description, price, duration_days]);
  return result.rows[0];
};

const getPlans = async () => {
  const result = await pool.query(Q.getAll);
  return result.rows;
};

const getPlanById = async (id) => {
  const result = await pool.query(Q.getById, [id]);
  if (result.rows.length === 0) throw new ApiError(404, 'Plan not found');
  return result.rows[0];
};

const updatePlan = async (id, fields) => {
  const existing = await pool.query(Q.checkExists, [id]);
  if (existing.rows.length === 0) throw new ApiError(404, 'Plan not found');

  const { name, description, price, duration_days, is_active } = fields;
  const result = await pool.query(Q.update, [name, description, price, duration_days, is_active, id]);
  return result.rows[0];
};

const deletePlan = async (id) => {
  const existing = await pool.query(Q.checkExists, [id]);
  if (existing.rows.length === 0) throw new ApiError(404, 'Plan not found');
  await pool.query(Q.delete, [id]);
};

module.exports = { createPlan, getPlans, getPlanById, updatePlan, deletePlan };