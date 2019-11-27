const mongoose = require("mongoose");
const config = require("config");

const dbURI = config.get("mongoURI");
const testDBURI = config.get("testDBURI");
const localTestDBURI = config.get("localTestDBURI");
const local = config.get('local');

mongoose.set("useFindAndModify", false);

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
};

const connectTestDB = async local => {
    try {
        if (local) {
            await mongoose.connect(localTestDBURI, {
                useNewUrlParser: true
            });
        } else {
            await mongoose.connect(testDBURI, {
                useNewUrlParser: true
            });
        }
        console.log("Test database connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const dropTestDB = async () => {
    try {
        let conn;
        if (local) {
            conn = await mongoose.createConnection(localTestDBURI);
        } else {
            conn = await mongoose.createConnection(testDBURI);
        }
        await conn.dropDatabase();
        await conn.close();
    } catch (error) {
        console.log(error);
    }
};

module.exports.connectDB = connectDB;
module.exports.connectTestDB = connectTestDB;
module.exports.dropTestDB = dropTestDB;
