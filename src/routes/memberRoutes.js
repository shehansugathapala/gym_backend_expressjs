const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { getMembers, getMemberById } = require('../controllers/memberController');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin', 'trainer'), getMembers);
router.get('/:id', authMiddleware, roleMiddleware('admin', 'trainer', 'member'), getMemberById);

module.exports = router;