const { app } = require('../server');
const Personnel = require('../models/Personnel');
const request = require('supertest');
const Leave = require('../models/Leave');
const Org = require('../models/Org');
const bcrypt = require('bcryptjs');
const { dropTestDB } = require('../config/db');
const http = require('http');
const server = http.createServer(app);

const PORT = 4000;

beforeAll(async () => {
    let org = new Org({
        name: "成功嶺"
    });

    await org.save();
    const salt = await bcrypt.genSalt(10);

    let adminUser = new Personnel({
        email: "chrisshyi13@gmail.com",
        name: "Chris Shyi",
        role: "site-admin",
        title: "勤務",
        org: org.id
    });
    adminUser.password = await bcrypt.hash("Nash1234@", salt);
    let hrUser = new Personnel({
        email: "brad-trav@gmail.com",
        name: "Brad Trav",
        role: "HR-admin",
        title: "勤務",
        org: org.id
    });
    hrUser.password = await bcrypt.hash("123456", salt);
    let regUser = new Personnel({
        email: "reguser@gmail.com",
        name: "regUser",
        role: "reg-user",
        title: "大隊長",
        org: org.id
    })
    regUser.password = await bcrypt.hash("123456", salt);

    await Promise.all([adminUser.save(), hrUser.save(), regUser.save()]);
    console.log(`Test server started on port ${PORT}`);
    server.listen(PORT);
});

describe("Leave API endpoints", () => {
    it("Test: site-admin can add leave", async () => {
        let res = await request(server).post('/api/auth/')
                                      .send({
                                          email: "chrisshyi13@gmail.com",
                                          password: "Nash1234@"
                                      });
        const token = res.body.token;
        const org = await Org.findOne({ name: "成功嶺" });
        const personnel = await Personnel.findOne({
            name: "regUser"
        });
        res = await request(server).post('/api/leaves')
                                         .set('x-auth-token', token)
                                         .send({
                                             leaveType: "例假",
                                             personnel: personnel.id,
                                             scheduled: false,
                                             duration: 24,
                                         });
        expect(res.statusCode).toEqual(200);
        expect(res.body.hasOwnProperty('leaveType'));
    });
    it("Test: HR-admin can add leave", async () => {
        let res = await request(server).post('/api/auth/')
                                      .send({
                                          email: "brad-trav@gmail.com",
                                          password: "123456"
                                      });
        const token = res.body.token;
        const org = await Org.findOne({ name: "成功嶺" });
        const personnel = await Personnel.findOne({
            name: "regUser"
        });
        res = await request(server).post('/api/leaves')
                                         .set('x-auth-token', token)
                                         .send({
                                             leaveType: "例假",
                                             personnel: personnel.id,
                                             scheduled: false,
                                             duration: 24,
                                         });
        expect(res.statusCode).toEqual(200);
        expect(res.body.hasOwnProperty('leaveType'));
    });

    it("Test: regular user cannot add leave", async () => {
        let res = await request(server).post('/api/auth/')
                                      .send({
                                          email: "reguser@gmail.com",
                                          password: "123456"
                                      });
        const token = res.body.token;
        const org = await Org.findOne({ name: "成功嶺" });
        const personnel = await Personnel.findOne({
            name: "regUser"
        });
        res = await request(server).post('/api/leaves')
                                         .set('x-auth-token', token)
                                         .send({
                                             leaveType: "例假",
                                             personnel: personnel.id,
                                             scheduled: false,
                                             duration: 24,
                                         });
        expect(res.statusCode).toEqual(401);
        expect(res.body.msg).toEqual("You are not authorized");
    });
}) 

afterAll(async () => {
    await dropTestDB();    
    await server.close();
})