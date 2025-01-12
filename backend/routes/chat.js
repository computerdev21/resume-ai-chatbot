import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct', // You can also try: llama3-70b-8192
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        const reply = data.choices?.[0]?.message?.content || 'No reply received.';
        res.json({ reply });

    } catch (err) {
        console.error('[Groq Chat Error]', err);
        res.status(500).json({ error: 'Failed to get response from Groq API' });
    }
});

export default router;
