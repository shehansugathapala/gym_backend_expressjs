const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

const register = async ({ full_name, email, password, role = 'member' }) => {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

  if (existing.rows.length > 0) {
    throw new ApiError(400, 'Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userResult = await pool.query(
    `INSERT INTO users (full_name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, full_name, email, role, status, created_at`,
    [full_name, email, hashedPassword, role]
  );

  const user = userResult.rows[0];

  if (role === 'member') {
    await pool.query(`INSERT INTO members (user_id) VALUES ($1)`, [user.id]);
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

const login = async ({ email, password }) => {
  const result = await pool.query(
    'SELECT id, full_name, email, password, role, status FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  delete user.password;

  return { user, token };
};

module.exports = {
  register,
  login,
};