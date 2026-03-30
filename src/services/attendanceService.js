const pool = require('../config/db');
const ApiError = require('../utils/ApiError');
const loadSql = require('../utils/loadSql');

const Q = loadSql('attendance.sql');

const checkIn = async (member_id, notes) => {
  const memberCheck = await pool.query('SELECT id FROM members WHERE id = $1', [member_id]);
  if (memberCheck.rows.length === 0) throw new ApiError(404, 'Member not found');

  const open = await pool.query(Q.checkOpenSession, [member_id]);
  if (open.rows.length > 0) throw new ApiError(400, 'Member already checked in. Please check out first.');

  const result = await pool.query(Q.insert, [member_id, notes]);
  return result.rows[0];
};

const checkOut = async (id) => {
  const existing = await pool.query(Q.checkRecordExists, [id]);
  if (existing.rows.length === 0) throw new ApiError(404, 'Attendance record not found');
  if (existing.rows[0].check_out) throw new ApiError(400, 'Already checked out');

  const result = await pool.query(Q.checkout, [id]);
  return result.rows[0];
};

const getAttendance = async () => {
  const result = await pool.query(Q.getAll);
  return result.rows;
};

const getAttendanceByMember = async (member_id) => {
  const memberCheck = await pool.query('SELECT id FROM members WHERE id = $1', [member_id]);
  if (memberCheck.rows.length === 0) throw new ApiError(404, 'Member not found');

  const result = await pool.query(Q.getByMember, [member_id]);
  return result.rows;
};

module.exports = { checkIn, checkOut, getAttendance, getAttendanceByMember };
