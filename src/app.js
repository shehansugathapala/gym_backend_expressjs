const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes         = require('./routes/authRoutes');
const memberRoutes       = require('./routes/memberRoutes');
const planRoutes         = require('./routes/planRoutes');
const trainerRoutes      = require('./routes/trainerRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const paymentRoutes      = require('./routes/paymentRoutes');
const attendanceRoutes      = require('./routes/attendanceRoutes');
const workoutPlannerRoutes  = require('./routes/workoutPlannerRoutes');

const notFound     = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? false : '*'),
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10kb' }));

app.use('/api/auth',          authRoutes);
app.use('/api/members',       memberRoutes);
app.use('/api/plans',         planRoutes);
app.use('/api/trainers',      trainerRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments',      paymentRoutes);
app.use('/api/attendance',      attendanceRoutes);
app.use('/api/workout-planner', workoutPlannerRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
