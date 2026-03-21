const asyncHandler = require('../utils/asyncHandler');
const memberService = require('../services/memberService');

exports.getMembers = asyncHandler(async (req, res) => {
  const members = await memberService.getMembers();

  res.status(200).json({
    success: true,
    data: members,
  });
});

exports.getMemberById = asyncHandler(async (req, res) => {
  const member = await memberService.getMemberById(req.params.id);

  res.status(200).json({
    success: true,
    data: member,
  });
});