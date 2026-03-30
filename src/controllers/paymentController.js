const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const paymentService = require('../services/paymentService');

exports.createPayment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const payment = await paymentService.createPayment(req.body);
  res.status(201).json({ success: true, message: 'Payment recorded', data: payment });
});

exports.getPayments = asyncHandler(async (req, res) => {
  const payments = await paymentService.getPayments();
  res.status(200).json({ success: true, data: payments });
});

exports.getPaymentById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  res.status(200).json({ success: true, data: payment });
});

exports.updatePayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.updatePayment(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Payment updated', data: payment });
});

exports.deletePayment = asyncHandler(async (req, res) => {
  await paymentService.deletePayment(req.params.id);
  res.status(200).json({ success: true, message: 'Payment deleted' });
});
