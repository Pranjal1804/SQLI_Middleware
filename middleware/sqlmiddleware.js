// middleware/sqlmiddleware.js
const logger = require('../utils/logger');

function detectSQLInjection(query) {
    const normalizedQuery = query.toLowerCase();

    const dangerousPatterns = [
        /\bor\b[\s\d]+[=<>]/i,
        /\bor\b.*?(?:true|false|\d+=\d+)/i,
        /union\s+(?:all\s+)?select/i,
        /;\s*(?:drop|delete|update|insert)/i,
        /--/,
        /\/\*/,
        /'.*?'.*?=.*?'.*?'/i,
        /\bxp_cmdshell\b/i,
        /\bexec\b/i,
        /\bdrop\b/i,
        /\bdelete\b/i,
        /\b(?:true|false|\d+)\s*(?:or|and)\s*(?:true|false|\d+)\b/i
    ];

    // Check for dangerous patterns
    const hasInjectionPattern = dangerousPatterns.some(pattern => pattern.test(normalizedQuery));
    
    // Additional database-specific checks
    const hasMultipleQueries = query.includes(';');
    const hasUnbalancedQuotes = (query.match(/'/g) || []).length % 2 !== 0;
    
    return hasInjectionPattern || hasMultipleQueries || hasUnbalancedQuotes;
}

function validateQuery(query) {
    // Basic query structure validation
    const validQueryTypes = ['select', 'insert', 'update', 'delete'];
    const queryType = query.trim().toLowerCase().split(' ')[0];
    
    if (!validQueryTypes.includes(queryType)) {
        return false;
    }
    
    // For demo purposes, only allow SELECT queries
    if (queryType !== 'select') {
        return false;
    }
    
    return true;
}

module.exports = (req, res, next) => {
    const { query } = req.body;
    
    if (!query) {
        return res.status(400).json({
            error: 'No query provided!'
        });
    }

    // Validate query structure
    if (!validateQuery(query)) {
        logger.warn(`Invalid query structure: ${query}`);
        return res.status(400).json({
            error: 'Invalid query structure'
        });
    }

    // Check for SQL injection
    if (detectSQLInjection(query)) {
        logger.warn(`SQL Injection attempt blocked: ${query}`);
        return res.status(403).json({
            error: 'Forbidden: SQL injection attempt detected'
        });
    }

    next();
};