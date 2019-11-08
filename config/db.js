const mongoose = require('mongoose');
const config = require('config');

const dbURI = config.get('mongoURI');
const testDBURI = config.get('testDBURI');

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

const connectTestDB = async () => {
    try {
        await mongoose.connect(testDBURI, {
            useNewUrlParser: true
        });
        console.log("Test database connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const dropTestDB = async () => {
    try {
        const conn = mongoose.createConnection(testDBURI); 
        await Promise.all([
            conn.dropCollection('personnels'),
            conn.dropCollection('orgs'),
            conn.dropCollection('leaves')
        ]);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports.connectDB = connectDB;
module.exports.connectTestDB = connectTestDB;
module.exports.dropTestDB = dropTestDB;