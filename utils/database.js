// utils/database.js
const mysql = require('mysql2/promise');
const logger = require('./logger');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'testuser',
    password: 'ZXC123#zxc',
    database: 'testdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

async function queryDatabase(query) {
    let connection;
    try {
        // Get connection from pool
        connection = await pool.getConnection();
        
        // Execute query
        const [results] = await connection.query(query);
        logger.info(`Query executed successfully: ${query}`);
        
        return results;
    } catch (error) {
        logger.error(`Database error: ${error.message}`, {
            query,
            error: error.stack
        });
        throw new Error(`Database query failed: ${error.message}`);
    } finally {
        // Release connection back to pool
        if (connection) connection.release();
    }
}

// Test database connection on startup
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        logger.info('Database connection established successfully');
        connection.release();
    } catch (error) {
        logger.error('Failed to connect to database:', error);
        process.exit(1);
    }
}

// Test connection when module loads
testConnection();

module.exports = {
    queryDatabase,
    pool // Export pool for potential direct use
};