# SQL Injection Middleware

A lightweight and effective middleware for detecting and blocking SQL injection attempts in Node.js applications. This middleware ensures database security by analyzing incoming queries and identifying malicious patterns.

## Features

- Detects common SQL injection patterns.
- Blocks unauthorized or dangerous queries.
- Logs suspicious activity for further analysis.
- Supports integration with Express.js and other frameworks.

---

## Usage

Here’s how to integrate the middleware into your Node.js application:

### **Basic Setup with Express.js**

```javascript
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## How It Works

### **Detection Mechanism**
The middleware checks for:

- Dangerous SQL patterns such as `OR 1=1`, `UNION SELECT`, etc.
- Multiple queries in a single statement (e.g., `SELECT *; DROP TABLE`).
- Unbalanced quotes or malformed queries.

### **Validation**
- Only valid SQL queries (e.g., `SELECT`, `INSERT`) are allowed.
- Supports whitelisting query types or custom validation logic.

---

## Examples

### Valid Query

```bash
curl -X POST http://localhost:3000/query \
-H "Content-Type: application/json" \
-d '{"query": "SELECT * FROM users WHERE id=1"}'
```

Response:
```json
{
  "message": "Query Executed Successfully!",
  "results": []
}
```

### SQL Injection Attempt

```bash
curl -X POST http://localhost:3000/query \
-H "Content-Type: application/json" \
-d '{"query": "SELECT * FROM users WHERE ' OR 'x'='x"}'
```

Response:
```json
{
  "error": "Forbidden: SQL injection attempt detected"
}
```

---

## Development

### **Project Structure**

```
.
├── middleware
│   └── sqlmiddleware.js   # Middleware logic
├── utils
│   ├── database.js        # Database connection and query logic
│   └── logger.js          # Logging utility
├── index.js               # Entry point
└── README.md              # Documentation
```

### **Testing Locally**

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sql-injection-middleware.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node index.js
   ```

4. Use the provided `curl` commands to test the middleware.

---

## Contributing

We welcome contributions! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

---


