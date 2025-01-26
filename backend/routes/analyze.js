const express = require('express');
const { OpenAI } = require('openai');

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1', // Groq endpoint
});

router.post('/', async (req, res) => {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
        return res.status(400).json({ error: 'Resume text is required' });
    }

    try {
        const systemPrompt = `You are an expert resume reviewer and career advisor. Always respond in JSON format.`.trim();

        const prompt = jobDescription?.trim()
            ? `
Below is a resume and a job description.

---
Resume:
${resumeText}
---

---
Job Description:
${jobDescription}
---

Analyze the resume against the job description and respond in JSON format:
{
  "score": 0-100,
  "ats_compliant": true or false,
  "missing_skills": [array of missing skills],
  "suggestions": [array of improvement tips],
  "shortlist_recommendation": true or false
}
`.trim()
            : `
Below is a resume.

---
Resume:
${resumeText}
---

Analyze the resume and:
- Suggest 2–3 job roles the candidate is suitable for.
- Provide a score out of 100.
- Mention ATS compatibility (true/false).
- Suggest improvements.
- List missing skills or keywords.

Respond in JSON format:
{
  "suggested_roles": ["e.g. Backend Developer", "e.g. Blockchain Engineer"],
  "score": 0-100,
  "ats_compliant": true or false,
  "missing_skills": [array of skills],
  "suggestions": [array of tips]
}
`.trim();

        const response = await openai.chat.completions.create({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        let parsed;

        try {
            parsed = JSON.parse(content);
        } catch (err) {
            parsed = {
                raw: content,
                error: "Couldn't parse structured JSON. Here's the raw output instead.",
            };
        }

        res.json(parsed);
    } catch (err) {
        console.error('[Analyze Error]', err);
        res.status(500).json({ error: 'Failed to analyze resume' });
    }
});

module.exports = router;
