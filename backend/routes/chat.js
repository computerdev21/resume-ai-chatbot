const express = require('express');
const { OpenAI } = require('openai');

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
});

router.post('/', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    try {
        const completion = await openai.chat.completions.create({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;
        res.json({ reply });
    } catch (err) {
        console.error('[Chat Error]', err);
        res.status(500).json({ error: 'Failed to get response from Groq API' });
    }
});

module.exports = router;
