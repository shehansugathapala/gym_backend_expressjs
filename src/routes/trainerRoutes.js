const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { updateTrainerValidation } = require('../validations/trainerValidation');
const {
  getTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
} = require('../controllers/trainerController');

const router = express.Router();

// GET /api/trainers — admin, member
router.get('/', authMiddleware, roleMiddleware('admin', 'member'), getTrainers);

// GET /api/trainers/:id
router.get('/:id', authMiddleware, roleMiddleware('admin', 'trainer', 'member'), getTrainerById);

// PUT /api/trainers/:id — admin or the trainer themselves
router.put('/:id', authMiddleware, roleMiddleware('admin', 'trainer'), updateTrainerValidation, updateTrainer);

// DELETE /api/trainers/:id — admin only
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteTrainer);

module.exports = router;
