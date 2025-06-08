const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const lectureController = require('../controllers/lectureController');

// Lecture routes
router.get('/certificate/:courseId', authMiddleware.verifyToken, lectureController.getCertificate);
router.post('/add-lecture', authMiddleware.verifyToken, lectureController.addLecture);
router.post('/update-lecture/:lectureId', authMiddleware.verifyToken, lectureController.updateLecture);
router.get('/completed-lectures', authMiddleware.verifyToken, lectureController.getCompletedLectures);

module.exports = router;