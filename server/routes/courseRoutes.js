const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const courseController = require('../controllers/courseController');

// Course routes
router.post('/add-course', authMiddleware.verifyToken, courseController.addCourse);
router.get('/courses', courseController.getAllCourses);
router.get('/search', courseController.search);
router.get('/my-courses', authMiddleware.verifyToken, courseController.getMyCourses);
router.get('/created-courses', authMiddleware.verifyToken, courseController.getcreatedCourses);
router.post('/add-course-progress', authMiddleware.verifyToken, courseController.addCourseProgress);
router.get('/my-courses/:courseId', courseController.getCourseContent);
router.get('/single-course/:courseId', courseController.getSingleCourse);
router.get('/courses/:courseId/feedback', courseController.showFeedback);
router.post('/my-courses/:courseId/feedback', authMiddleware.verifyToken, courseController.saveFeedback);
router.get('/edit-course/:courseId', authMiddleware.verifyToken, courseController.getCreatedcourseById);
router.put('/edit-course/:courseId', authMiddleware.verifyToken, courseController.editCourse);
router.delete('/delete-course/:courseId', authMiddleware.verifyToken, courseController.deleteCourse);

module.exports = router;