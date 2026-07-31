const express = require('express');
const OpenAI = require('openai');
const requireAuth = require('../middleware/auth');

const router = express.Router();

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: message }],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
