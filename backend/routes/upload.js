const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-extraction');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/resume', upload.single('resume'), async (req, res) => {
    const filePath = req.file.path;

    try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdf(dataBuffer);

        fs.unlinkSync(filePath); // Cleanup
        res.json({ text: pdfData.text });
    } catch (err) {
        console.error('[Upload Error]', err);
        res.status(500).json({ error: 'Failed to process resume' });
    }
});

module.exports = router;
