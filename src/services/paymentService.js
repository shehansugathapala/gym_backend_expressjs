const pool = require('../config/db');
const ApiError = require('../utils/ApiError');
const loadSql = require('../utils/loadSql');

const Q = loadSql('payments.sql');

const createPayment = async ({ member_id, subscription_id, amount, payment_method, status, notes }) => {
  const memberCheck = await pool.query('SELECT id FROM members WHERE id = $1', [member_id]);
  if (memberCheck.rows.length === 0) throw new ApiError(404, 'Member not found');

  const subCheck = await pool.query('SELECT id FROM subscriptions WHERE id = $1', [subscription_id]);
  if (subCheck.rows.length === 0) throw new ApiError(404, 'Subscription not found');

  const result = await pool.query(Q.insert, [member_id, subscription_id, amount, payment_method, status, notes]);
  return result.rows[0];
};

const getPayments = async () => {
  const result = await pool.query(Q.getAll);
  return result.rows;
};

const getPaymentById = async (id) => {
  const result = await pool.query(Q.getById, [id]);
  if (result.rows.length === 0) throw new ApiError(404, 'Payment not found');
  return result.rows[0];
};

const updatePayment = async (id, fields) => {
  const existing = await pool.query(Q.checkExists, [id]);
  if (existing.rows.length === 0) throw new ApiError(404, 'Payment not found');

  const { amount, payment_method, status, notes } = fields;
  const result = await pool.query(Q.update, [amount, payment_method, status, notes, id]);
  return result.rows[0];
};

const deletePayment = async (id) => {
  const existing = await pool.query(Q.checkExists, [id]);
  if (existing.rows.length === 0) throw new ApiError(404, 'Payment not found');
  await pool.query(Q.delete, [id]);
};

module.exports = { createPayment, getPayments, getPaymentById, updatePayment, deletePayment };
