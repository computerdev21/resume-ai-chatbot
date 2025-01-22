// 🔥 FIRST line: load .env before importing anything else
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const chatRoute = require('./routes/chat');
const uploadRoute = require('./routes/upload');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoute);
app.use('/api/upload', uploadRoute);

app.listen(5001, () => {
    console.log('🔊 Backend running at http://localhost:5001');
});
