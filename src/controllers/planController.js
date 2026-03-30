const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const planService = require('../services/planService');

exports.createPlan = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const plan = await planService.createPlan(req.body);
  res.status(201).json({ success: true, message: 'Plan created successfully', data: plan });
});

exports.getPlans = asyncHandler(async (req, res) => {
  const plans = await planService.getPlans();
  res.status(200).json({ success: true, data: plans });
});

exports.getPlanById = asyncHandler(async (req, res) => {
  const plan = await planService.getPlanById(req.params.id);
  res.status(200).json({ success: true, data: plan });
});

exports.updatePlan = asyncHandler(async (req, res) => {
  const plan = await planService.updatePlan(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Plan updated successfully', data: plan });
});

exports.deletePlan = asyncHandler(async (req, res) => {
  await planService.deletePlan(req.params.id);
  res.status(200).json({ success: true, message: 'Plan deleted successfully' });
});