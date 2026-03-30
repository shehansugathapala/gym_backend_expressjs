const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const trainerService = require('../services/trainerService');

exports.getTrainers = asyncHandler(async (req, res) => {
  const trainers = await trainerService.getTrainers();
  res.status(200).json({ success: true, data: trainers });
});

exports.getTrainerById = asyncHandler(async (req, res) => {
  const trainer = await trainerService.getTrainerById(req.params.id);
  res.status(200).json({ success: true, data: trainer });
});

exports.updateTrainer = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const trainer = await trainerService.updateTrainer(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Trainer updated successfully', data: trainer });
});

exports.deleteTrainer = asyncHandler(async (req, res) => {
  await trainerService.deleteTrainer(req.params.id);
  res.status(200).json({ success: true, message: 'Trainer deleted successfully' });
});
