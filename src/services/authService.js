const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');
const loadSql = require('../utils/loadSql');

const Q = loadSql('auth.sql');

const register = async ({ full_name, email, password, role = 'member' }) => {
  const existing = await pool.query(Q.findIdByEmail, [email]);
  if (existing.rows.length > 0) {
    throw new ApiError(400, 'Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userResult = await pool.query(Q.insertUser, [full_name, email, hashedPassword, role]);
  const user = userResult.rows[0];

  if (role === 'member')  await pool.query(Q.insertMember,  [user.id]);
  if (role === 'trainer') await pool.query(Q.insertTrainer, [user.id]);

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
};

const login = async ({ email, password }) => {
  const result = await pool.query(Q.findByEmail, [email]);

  if (result.rows.length === 0) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  delete user.password_hash;

  return { user, token };
};

module.exports = { register, login };