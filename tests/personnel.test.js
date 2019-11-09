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
    let org1 = new Org({
        name: "成功嶺"
    });
    let org2 = new Org({
        name: "台糖公司"
    });
    await Promise.all([org1.save(), org2.save()]);
    const salt = await bcrypt.genSalt(10);

    let adminUser = new Personnel({
        email: "chrisshyi13@gmail.com",
        name: "Chris Shyi",
        role: "site-admin",
        title: "勤務",
        org: org1.id
    });
    adminUser.password = await bcrypt.hash("Nash1234@", salt);
    let hrUser = new Personnel({
        email: "brad-trav@gmail.com",
        name: "Brad Trav",
        role: "HR-admin",
        title: "勤務",
        org: org1.id
    });
    hrUser.password = await bcrypt.hash("123456", salt);
    let regUser = new Personnel({
        email: "reguser@gmail.com",
        name: "regUser",
        role: "reg-user",
        title: "大隊長",
        org: org1.id
    });
    regUser.password = await bcrypt.hash("123456", salt);
    let regUser2 = new Personnel({
        email: "reguser2@gmail.com",
        name: "regUser2",
        role: "reg-user",
        title: "大隊長",
        org: org2.id
    });
    regUser2.password = await bcrypt.hash("123456", salt);

    await Promise.all([adminUser.save(), hrUser.save(), regUser.save(), regUser2.save()]);
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

    describe("Test personnel information retrieval", () => {
        it("site-admin can retrieve information of personnel in same organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;

            const regUser = await Personnel.findOne({
                email: "reguser@gmail.com"
            });

            res = await request(server).get(`/api/personnel/${regUser.id}`)
                                       .set('x-auth-token', token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("personnel"));
                                        
        });
        it("site-admin can retrieve information of personnel in different organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;

            const regUser2 = await Personnel.findOne({
                email: "reguser2@gmail.com"
            });
            res = await request(server).get(`/api/personnel/${regUser2.id}`)
                                       .set('x-auth-token', token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("personnel"));
        });
        it("HR-admin can retrieve information of personnel in same organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            const regUser = await Personnel.findOne({
                email: "reguser@gmail.com"
            });

            res = await request(server).get(`/api/personnel/${regUser.id}`)
                                       .set('x-auth-token', token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("personnel"));                                        
        });
        it("HR-admin cannot retrieve information of personnel in different organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            const regUser2 = await Personnel.findOne({
                email: "reguser2@gmail.com"
            });
            res = await request(server).get(`/api/personnel/${regUser2.id}`)
                                       .set('x-auth-token', token);
            expect(res.statusCode).toEqual(403);
        });
        it("Regular user can retrieve their own information", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            const regUser = await Personnel.findOne({
                email: "reguser@gmail.com"
            });
            res = await request(server).get(`/api/personnel/${regUser.id}`)
                                       .set('x-auth-token', token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("personnel"));
        });
        it("Regular user cannot retreive others' information", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            const regUser2 = await Personnel.findOne({
                email: "reguser2@gmail.com"
            });
            res = await request(server).get(`/api/personnel/${regUser2.id}`)
                                       .set('x-auth-token', token);
            expect(res.statusCode).toEqual(403);
        });
    });
}); 

afterAll(async () => {
    await dropTestDB();    
    server.close();
});