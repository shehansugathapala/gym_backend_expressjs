const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { updateMemberValidation } = require('../validations/memberValidation');
const {
  getMembers,
  getMemberById,
  getMyProfile,
  updateMember,
  deleteMember,
} = require('../controllers/memberController');

const router = express.Router();

// GET /api/members — admin & trainer only
router.get('/', authMiddleware, roleMiddleware('admin', 'trainer'), getMembers);

// GET /api/members/me — logged-in member's own profile
router.get('/me', authMiddleware, roleMiddleware('admin', 'trainer', 'member'), getMyProfile);

// GET /api/members/:id — admin, trainer, or the member themselves
router.get('/:id', authMiddleware, roleMiddleware('admin', 'trainer', 'member'), getMemberById);

// PUT /api/members/:id — admin or the member themselves
router.put('/:id', authMiddleware, roleMiddleware('admin', 'member'), updateMemberValidation, updateMember);

// DELETE /api/members/:id — admin only
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteMember);

module.exports = router;