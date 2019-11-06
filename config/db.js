const mongoose = require('mongoose');
const config = require('config');

const dbURI = config.get('mongoURI');

mongoose.set('useFindAndModify', false);

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1); // exit with an error code
    }
}

module.exports = connectDB;