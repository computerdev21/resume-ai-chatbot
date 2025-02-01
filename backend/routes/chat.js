const express = require('express');
const { OpenAI } = require('openai');
const { getStoredResume } = require('./upload');

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

router.post('/', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const resumeText = getStoredResume();

    if (!resumeText) {
        return res.status(400).json({ error: 'Resume not found. Please upload your resume first.' });
    }

    const systemPrompt = `
You are a professional resume consultant. The user uploaded the following resume:

---
${resumeText}
---

Now answer their questions as if you're advising them directly based on their resume.
Only give feedback relevant to their resume.

`.trim();

    try {
        const completion = await openai.chat.completions.create({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;
        res.json({ reply });
    } catch (err) {
        console.error('[Chat Error]', err);
        res.status(500).json({ error: 'Failed to get response from Groq AI' });
    }
});

module.exports = router;
