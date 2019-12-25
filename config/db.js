const mongoose = require("mongoose");
const config = require("config");

const dbURI = config.get("mongoURI");
const testDBURI = config.get("testDBURI");
const localTestDBURI = config.get("localTestDBURI");
const localDBURI = config.get("localDBURI");
const local = config.get("local");
const Org = require("../models/Org");
const Personnel = require("../models/Personnel");
const { Leave } = require("../models/Leave");
const bcrypt = require("bcryptjs");

mongoose.set("useFindAndModify", false);

const connectDB = async local => {
    try {
        if (local) {
            await mongoose.connect(localDBURI, {
                useNewUrlParser: true
            });
        } else {
            await mongoose.connect(dbURI, {
                useNewUrlParser: true
            });
        }
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
            console.log("Local test database connected");
        } else {
            await mongoose.connect(testDBURI, {
                useNewUrlParser: true
            });
            console.log("Remote test database connected");
        }
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

const dropTestTable = async tableName => {
    try {

        let conn;
        if (local) {
            conn = await mongoose.createConnection(localTestDBURI);
        } else {
            conn = await mongoose.createConnection(testDBURI);
        }
        await conn.dropCollection(tableName);
        await conn.close();
    } catch (error) {
        console.error(error);
    }
}

async function seedLeaves() {
    const dropConn = await mongoose.createConnection(localDBURI, {
        useNewUrlParser: true
    });
    await dropConn.dropDatabase();
    await mongoose.connect(localDBURI, {
        useNewUrlParser: true
    });

    let org = await Org.findOne({
        name: "成功嶺"
    });
    const salt = await bcrypt.genSalt(10);

    if (org === null) {
        org = new Org({
            name: "成功嶺"
        });
        await org.save();
        console.log(`Org id: ${org.id}`);
    }
    let adminUser = new Personnel({
        email: "testAdmin@gmail.com",
        name: "Test Admin",
        role: "site-admin",
        title: "勤務",
        org: org.id
    });
    adminUser.password = await bcrypt.hash("123456", salt);
    await adminUser.save();
    let newLeave = new Leave({
        org: org.id,
        leaveType: "例假",
        personnel: adminUser._id,
        scheduled: true,
        originalDate: new Date(),
        scheduledDate: new Date(),
        duration: 24
    });

    let newLeavePromises = [];

    newLeavePromises.push(newLeave.save());
    for (let i = 0; i < 6; i++) {
        let personnel = new Personnel({
            email: `test${i}@gmail.com`,
            password: "blah",
            name: `Test personnel ${i}`,
            title: "勤務",
            role: "reg-user",
            org: org.id
        });

        personnel.password = await bcrypt.hash('blah', salt);

        await personnel.save();

        newLeave = new Leave({
            org: org.id,
            leaveType: "例假",
            personnel: personnel._id,
            scheduled: true,
            originalDate: new Date(),
            scheduledDate: new Date(),
            duration: 24
        });

        let newLeave2 = new Leave({
            org: org.id,
            leaveType: "例假",
            personnel: personnel._id,
            scheduled: true,
            originalDate: new Date(),
            scheduledDate: new Date("2019-11-05"),
            duration: 24
        });
        // add 10 unscheduled leaves each
        for (let j = 1; j < 11; j++) {
            let newUnscheduledLeave = new Leave({
                org: org.id,
                leaveType: "例假",
                personnel: personnel._id,
                scheduled: false,
                originalDate: new Date(2019, 11, j),
                duration: 24
            });
            newLeavePromises.push(newUnscheduledLeave.save());
        }
        newLeavePromises.push(newLeave.save());
        newLeavePromises.push(newLeave2.save());
    }
    await Promise.all(newLeavePromises);
    await mongoose.disconnect();
}

module.exports = {
    connectDB,
    connectTestDB,
    dropTestDB,
    seedLeaves,
    dropTestTable
}