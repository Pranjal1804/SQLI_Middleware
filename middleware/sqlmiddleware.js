// middleware/sqlmiddleware.js
const logger = require('../utils/logger');

function detectSQLInjection(query) {
    // Convert to lowercase for case-insensitive matching
    const normalizedQuery = query.toLowerCase();

    // Simple but effective patterns for common SQL injection techniques
    const dangerousPatterns = [
        /\bor\b[\s\d]+[=<>]/i,           // OR with comparison
        /\bor\b.*?(?:true|false|\d+=\d+)/i,  // OR with boolean/number comparison
        /union\s+(?:all\s+)?select/i,     // UNION-based injection
        /;\s*(?:drop|delete|update|insert)/i,  // Stacked queries
        /--/,                             // Comments
        /\/\*/,                           // Multi-line comments
        /'.*?'.*?=.*?'.*?'/i,            // Quote-based injection
        /\bxp_cmdshell\b/i,              // Command execution
        /\bexec\b/i,                      // Stored procedure execution
        /\bdrop\b/i,                      // DROP statements
        /\bdelete\b/i,                    // DELETE statements
        /\b(?:true|false|\d+)\s*(?:or|and)\s*(?:true|false|\d+)\b/i  // Boolean logic injection
    ];

    return dangerousPatterns.some(pattern => pattern.test(normalizedQuery));
}

module.exports = (req, res, next) => {
    const { query } = req.body;
    
    if (!query) {
        return next();
    }

    if (detectSQLInjection(query)) {
        logger.warn(`SQL Injection attempt blocked: ${query}`);
        return res.status(403).json({
            error: 'Forbidden: SQL injection attempt detected'
        });
    }

    next();
};