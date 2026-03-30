const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { checkInValidation } = require('../validations/attendanceValidation');
const {
  checkIn,
  checkOut,
  getAttendance,
  getAttendanceByMember,
} = require('../controllers/attendanceController');

const router = express.Router();

// GET /api/attendance — admin & trainer
router.get('/', authMiddleware, roleMiddleware('admin', 'trainer'), getAttendance);

// GET /api/attendance/member/:memberId — admin, trainer, member
router.get('/member/:memberId', authMiddleware, roleMiddleware('admin', 'trainer', 'member'), getAttendanceByMember);

// POST /api/attendance/check-in — admin or member
router.post('/check-in', authMiddleware, roleMiddleware('admin', 'member'), checkInValidation, checkIn);

// PUT /api/attendance/check-out/:id — admin or member
router.put('/check-out/:id', authMiddleware, roleMiddleware('admin', 'member'), checkOut);

module.exports = router;
