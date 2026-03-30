const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const attendanceService = require('../services/attendanceService');

exports.checkIn = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const { member_id, notes } = req.body;
  const record = await attendanceService.checkIn(member_id, notes);
  res.status(201).json({ success: true, message: 'Check-in recorded', data: record });
});

exports.checkOut = asyncHandler(async (req, res) => {
  const record = await attendanceService.checkOut(req.params.id);
  res.status(200).json({ success: true, message: 'Check-out recorded', data: record });
});

exports.getAttendance = asyncHandler(async (req, res) => {
  const records = await attendanceService.getAttendance();
  res.status(200).json({ success: true, data: records });
});

exports.getAttendanceByMember = asyncHandler(async (req, res) => {
  const records = await attendanceService.getAttendanceByMember(req.params.memberId);
  res.status(200).json({ success: true, data: records });
});
