const express = require('express');
const app = express();
const connectDB = require('./config/db');


const PORT = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res) => {
    res.send('API running');
});
app.use(express.json()); // Body parser for JSON data

// app.use('/api/users', require('./routes/api/users'));
// app.use('/api/auth', require('./routes/api/auth'));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

