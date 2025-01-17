// utils/database.js
const logger = require('./logger');

async function queryDatabase(query) {
    try {
        // For demo purposes, always return mock data for SELECT queries
        const normalizedQuery = query.toLowerCase().trim();
        
        if (!normalizedQuery.startsWith('select')) {
            throw new Error('Only SELECT queries are supported');
        }

        // Mock database response
        return [
            { id: 1, name: 'test user 1', email: 'test1@example.com' },
            { id: 2, name: 'test user 2', email: 'test2@example.com' }
        ];
    } catch (error) {
        logger.error(`Database error: ${error.message}`);
        throw error;
    }
}

module.exports = {
    queryDatabase
};