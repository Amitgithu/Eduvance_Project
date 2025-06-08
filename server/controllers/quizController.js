const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Replace with your Gemini API key

const generateQuiz = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // console.log("Prompt Data : ", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: error.response ? error.response.data : 'Internal server error',
    });
  }
};

module.exports = { generateQuiz };
