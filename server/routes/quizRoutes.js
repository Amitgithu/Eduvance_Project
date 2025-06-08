const express = require('express');
const { generateQuiz } = require('../controllers/quizController');

const router = express.Router();

// POST route to generate quiz
router.post('/generateQuiz', generateQuiz);

module.exports = router;
