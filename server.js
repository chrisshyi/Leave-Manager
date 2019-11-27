const express = require('express');
const app = express();
const { connectDB, connectTestDB } = require('./config/db');
const config = require('config');
const PORT = process.env.PORT || 5000;
const testing = config.get("testing"); 
const local = config.get('local');


if (testing) {
    connectTestDB(local);
} else {
    connectDB(local);
}

app.get('/', (req, res) => {
    res.send('API running');
});
app.use(express.json()); // Body parser for JSON data

app.use('/api/personnel', require('./routes/api/personnel'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/leaves', require('./routes/api/leaves'));
app.use('/api/orgs', require('./routes/api/orgs'));

if (!testing) {
    const server = app.listen(PORT, function() {
        console.log(`Server started on port ${PORT}`);
    });
}

module.exports.app = app;