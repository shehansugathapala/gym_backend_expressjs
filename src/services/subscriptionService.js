const pool = require('../config/db');
const ApiError = require('../utils/ApiError');
const loadSql = require('../utils/loadSql');

const Q = loadSql('subscriptions.sql');

const createSubscription = async ({ member_id, plan_id, start_date, end_date, status }) => {
  const memberCheck = await pool.query('SELECT id FROM members WHERE id = $1', [member_id]);
  if (memberCheck.rows.length === 0) throw new ApiError(404, 'Member not found');

  const planCheck = await pool.query('SELECT id FROM plans WHERE id = $1', [plan_id]);
  if (planCheck.rows.length === 0) throw new ApiError(404, 'Plan not found');

  const result = await pool.query(Q.insert, [member_id, plan_id, start_date, end_date, status]);
  return result.rows[0];
};

const getSubscriptions = async () => {
  const result = await pool.query(Q.getAll);
  return result.rows;
};

const getSubscriptionById = async (id) => {
  const result = await pool.query(Q.getById, [id]);
  if (result.rows.length === 0) throw new ApiError(404, 'Subscription not found');
  return result.rows[0];
};

const updateSubscription = async (id, fields) => {
  const existing = await pool.query(Q.checkExists, [id]);
  if (existing.rows.length === 0) throw new ApiError(404, 'Subscription not found');

  const { plan_id, start_date, end_date, status } = fields;
  const result = await pool.query(Q.update, [plan_id, start_date, end_date, status, id]);
  return result.rows[0];
};

const deleteSubscription = async (id) => {
  const existing = await pool.query(Q.checkExists, [id]);
  if (existing.rows.length === 0) throw new ApiError(404, 'Subscription not found');
  await pool.query(Q.delete, [id]);
};

module.exports = { createSubscription, getSubscriptions, getSubscriptionById, updateSubscription, deleteSubscription };
