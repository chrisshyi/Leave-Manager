const { app } = require('../server');
const Personnel = require('../models/Personnel');
const request = require('supertest');
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

    await Promise.all([adminUser.save(), hrUser.save()]);
    console.log(`Test server started on port ${PORT}`);
    server.listen(PORT);
});

describe("Personnel API endpoints", () => {
    it("Test personnel login", async () => {
        const res = await request(server).post('/api/auth/')
                                      .send({
                                          email: "brad-trav@gmail.com",
                                          password: "123456"
                                      });
        expect(res.statusCode).toEqual(200);
        expect(res.body.hasOwnProperty('token'));
    });
    it("Test: site-admin can create personnel", async () => {
        let res = await request(server).post('/api/auth/')
                                      .send({
                                          email: "chrisshyi13@gmail.com",
                                          password: "Nash1234@"
                                      });
        const token = res.body.token;
        const org = await Org.findOne({ name: "成功嶺" });
        res = await request(server).post('/api/personnel')
                                         .set('x-auth-token', token)
                                         .send({
                                             name: "test user2",
                                             email: "test2@gmail.com",
                                             password: "123456",
                                             title: "勤務",
                                             role: "reg-user",
                                             org: org.id
                                         });
        expect(res.statusCode).toEqual(200);
        expect(res.body.hasOwnProperty('token'));
    });

    it("Test: HR-admin cannot create personnel", async () => {
        let res = await request(server).post('/api/auth/')
                                      .send({
                                          email: "brad-trav@gmail.com",
                                          password: "123456"
                                      });
        const token = res.body.token;
        const org = await Org.findOne({ name: "成功嶺" });
        res = await request(server).post('/api/personnel')
                                         .set('x-auth-token', token)
                                         .send({
                                             name: "test user",
                                             email: "test@gmail.com",
                                             password: "123456",
                                             title: "勤務",
                                             role: "reg-user",
                                             org: org.id
                                         });
        expect(res.statusCode).toEqual(401);
        expect(res.body.hasOwnProperty('msg'));
        expect(res.body.msg).toEqual("You are not authorized");
    });
}) 

afterAll(async () => {
    await dropTestDB();    
    await server.close();
})