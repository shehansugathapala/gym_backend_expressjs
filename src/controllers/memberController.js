const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const memberService = require('../services/memberService');

exports.getMembers = asyncHandler(async (req, res) => {
  const members = await memberService.getMembers();
  res.status(200).json({ success: true, data: members });
});

exports.getMemberById = asyncHandler(async (req, res) => {
  const member = await memberService.getMemberById(req.params.id);
  res.status(200).json({ success: true, data: member });
});

exports.updateMember = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const member = await memberService.updateMember(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Member updated successfully', data: member });
});

exports.deleteMember = asyncHandler(async (req, res) => {
  await memberService.deleteMember(req.params.id);
  res.status(200).json({ success: true, message: 'Member deleted successfully' });
});