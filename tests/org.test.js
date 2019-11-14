const { app } = require('../server');
const Personnel = require('../models/Personnel');
const request = require('supertest');
const mongoose = require('mongoose');
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
    let hrUser1 = new Personnel({
        email: "hrUser1@gmail.com",
        name: "hrUser1",
        role: "HR-admin",
        title: "勤務",
        org: org1.id
    });
    hrUser1.password = await bcrypt.hash("123456", salt);
    let hrUser2 = new Personnel({
        email: "hrUser2@gmail.com",
        name: "hrUser2",
        role: "HR-admin",
        title: "勤務",
        org: org2.id
    });
    hrUser2.password = await bcrypt.hash("123456", salt);

    org1Users = [];
    for (let i = 0; i < 5; i++) {
        let regUser = new Personnel({
            email: `reguser1${i}@gmail.com`,
            name: "regUser",
            role: "reg-user",
            title: "大隊長",
            org: org1.id
        });
        regUser.password = await bcrypt.hash("123456", salt);
        org1Users.push(regUser.save());
    }
    org2Users = [];
    for (let i = 0; i < 3; i++) {
        let regUser = new Personnel({
            email: `reguser2${i}@gmail.com`,
            name: "regUser",
            role: "reg-user",
            title: "大隊長",
            org: org2.id
        });
        regUser.password = await bcrypt.hash("123456", salt);
        org2Users.push(regUser.save());
    }
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

    await Promise.all([adminUser.save(), hrUser1.save(), hrUser2.save(), regUser.save(), regUser2.save()]);
    await Promise.all(org1Users);
    await Promise.all(org2Users);
    console.log(`Test server started on port ${PORT}`);
    server.listen(PORT);
});

describe("Org API endpoints", () => {
    describe("Org creation tests", () => {

        it("Site-admin can create new organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;
            res = await request(server).post('/api/orgs').set('x-auth-token', token)
                                       .send({
                                           name: "成功之路"
                                       }); 
            expect(res.statusCode).toBe(200);
            expect(res.body.org.name).toBe("成功之路");
        });
        it("Creating an org with a name results in an error", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;
            res = await request(server).post('/api/orgs').set('x-auth-token', token)
                                       .send({
                                           foo: "成功之路"
                                       }); 
            expect(res.statusCode).toBe(400);
            expect(res.body.hasOwnProperty("errors"));
        });
    });
    describe("Test org information retrieval", () => {
        it("site-admin can retrieve same org information", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;

            const org1 = await Org.findOne({
                name: "成功嶺"
            });

            res = await request(server).get(`/api/orgs/${org1.id}`)
                                       .set('x-auth-token', token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("org"));
            expect(res.body['org']['personnel'].length).toBe(8);
            
        });
        it("site-admin can retrieve different org information", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;

            const org2 = await Org.findOne({
                name: "台糖公司"
            });

            res = await request(server).get(`/api/orgs/${org2.id}`)
                                       .set('x-auth-token', token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("org"));
            expect(res.body['org']['personnel'].length).toBe(5);
            
        });
        it("HR-admin can retrieve same org information", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "hrUser1@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            const org = await Org.findOne({
                name: "成功嶺"
            });

            res = await request(server).get(`/api/orgs/${org.id}`)
                                       .set('x-auth-token', token);
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("org"));
            expect(res.body['org']['personnel'].length).toBe(8);
            
        });
        it("HR-admin cannot retrieve different org information", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "hrUser1@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            const org = await Org.findOne({
                name: "台糖公司"
            });

            res = await request(server).get(`/api/orgs/${org.id}`)
                                       .set('x-auth-token', token);
            expect(res.statusCode).toEqual(401);
        });
        it("regular user cannot retrieve same org information", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            const org = await Org.findOne({
                name: "成功嶺"
            });

            res = await request(server).get(`/api/orgs/${org.id}`)
                                       .set('x-auth-token', token);
            expect(res.statusCode).toEqual(401);
        });
        it("regular user cannot retrieve different org information", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            const org = await Org.findOne({
                name: "台糖公司"
            });

            res = await request(server).get(`/api/orgs/${org.id}`)
                                       .set('x-auth-token', token);
            expect(res.statusCode).toEqual(401);
        });
    });
}); 

afterAll(async () => {
    await dropTestDB();    
    server.close();
});