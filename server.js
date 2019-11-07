const express = require('express');
const app = express();
const { connectDB, connectTestDB } = require('./config/db');
const config = require('config');


const PORT = process.env.PORT || 5000;
const testing = config.get('testing');

if (testing) {
    connectTestDB();
} else {
    connectDB();
}

app.get('/', (req, res) => {
    res.send('API running');
});
app.use(express.json()); // Body parser for JSON data

app.use('/api/personnel', require('./routes/api/personnel'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/leaves', require('./routes/api/leaves'));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports.app = app;