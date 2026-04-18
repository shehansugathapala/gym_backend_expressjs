const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const workoutPlannerService = require('../services/workoutPlannerService');

// POST /api/workout-planner/generate
exports.generatePlan = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const { goal, level, days_per_week } = req.body;
  const memberId = req.params.memberId;

  const plan = await workoutPlannerService.generatePlan(memberId, { goal, level, days_per_week });

  res.status(201).json({
    success: true,
    message: 'Workout plan generated successfully',
    data: plan,
  });
});

// GET /api/workout-planner/member/:memberId
exports.getPlansByMember = asyncHandler(async (req, res) => {
  const plans = await workoutPlannerService.getPlansByMember(req.params.memberId);
  res.status(200).json({ success: true, data: plans });
});

// GET /api/workout-planner/:id
exports.getPlanById = asyncHandler(async (req, res) => {
  const plan = await workoutPlannerService.getPlanById(req.params.id);
  res.status(200).json({ success: true, data: plan });
});

// DELETE /api/workout-planner/:id
exports.deletePlan = asyncHandler(async (req, res) => {
  await workoutPlannerService.deletePlan(req.params.id);
  res.status(200).json({ success: true, message: 'Workout plan deleted successfully' });
});
