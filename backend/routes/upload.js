const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-extraction');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

let storedResume = '';

router.post('/resume', upload.single('resume'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdf(dataBuffer); // ✅ fixed here

        storedResume = pdfData.text;
        fs.unlinkSync(filePath);

        res.json({ text: pdfData.text });
    } catch (err) {
        console.error('[Upload Error]', err);
        res.status(500).json({ error: 'Failed to process resume' });
    }
});

module.exports = router;
module.exports.getStoredResume = () => storedResume;
