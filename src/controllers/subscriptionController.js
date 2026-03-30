const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const subscriptionService = require('../services/subscriptionService');

exports.createSubscription = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const subscription = await subscriptionService.createSubscription(req.body);
  res.status(201).json({ success: true, message: 'Subscription created', data: subscription });
});

exports.getSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await subscriptionService.getSubscriptions();
  res.status(200).json({ success: true, data: subscriptions });
});

exports.getSubscriptionById = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.getSubscriptionById(req.params.id);
  res.status(200).json({ success: true, data: subscription });
});

exports.updateSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.updateSubscription(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Subscription updated', data: subscription });
});

exports.deleteSubscription = asyncHandler(async (req, res) => {
  await subscriptionService.deleteSubscription(req.params.id);
  res.status(200).json({ success: true, message: 'Subscription deleted' });
});
