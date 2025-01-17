// index.js
const express = require('express');
const sqlInjectionMiddleware = require('./middleware/sqlmiddleware');
const { queryDatabase } = require('./utils/database');

const app = express();
app.use(express.json());
app.use(sqlInjectionMiddleware);

app.post('/query', async (req, res) => {
    const { query } = req.body;
    
    if (!query) {
        return res.status(400).json({
            error: 'No query provided!'
        });
    }

    try {
        const results = await queryDatabase(query);
        res.json({
            message: 'Query Executed Successfully!',
            results
        });
    } catch (error) {
        res.status(500).json({
            error: 'Database query failed!',
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;