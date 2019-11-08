const { app } = require("../server");
const Personnel = require("../models/Personnel");
const request = require("supertest");
const { Leave } = require("../models/Leave");
const Org = require("../models/Org");
const bcrypt = require("bcryptjs");
const { dropTestDB } = require("../config/db");
const http = require("http");
const server = http.createServer(app);

const PORT = 4000;

beforeAll(async () => {
    let org1 = new Org({
        name: "成功嶺"
    });
    await org1.save();
    let org2 = new Org({
        name: "台糖公司"
    });
    await org2.save();
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

describe("Leave API endpoints", () => {
    describe("Leave addition tests", () => {
        it("Test: site-admin can add leave", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;
            const org = await Org.findOne({ name: "成功嶺" });
            const personnel = await Personnel.findOne({
                name: "regUser"
            });
            res = await request(server)
                .post("/api/leaves")
                .set("x-auth-token", token)
                .send({
                    leaveType: "例假",
                    personnel: personnel.id,
                    scheduled: false,
                    duration: 24
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("leaveType"));
        });
        it("Test: HR-admin can add leave", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            const org = await Org.findOne({ name: "成功嶺" });
            const personnel = await Personnel.findOne({
                name: "regUser"
            });
            res = await request(server)
                .post("/api/leaves")
                .set("x-auth-token", token)
                .send({
                    leaveType: "例假",
                    personnel: personnel.id,
                    scheduled: false,
                    duration: 24
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("leaveType"));
        });

        it("Test: regular user cannot add leave", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            const org = await Org.findOne({ name: "成功嶺" });
            const personnel = await Personnel.findOne({
                name: "regUser"
            });
            res = await request(server)
                .post("/api/leaves")
                .set("x-auth-token", token)
                .send({
                    leaveType: "例假",
                    personnel: personnel.id,
                    scheduled: false,
                    duration: 24
                });
            expect(res.statusCode).toEqual(401);
            expect(res.body.msg).toEqual("You are not authorized");
        });
    });

    describe("Leave info retrieval tests", () => {
        let leaveId, leaveId2;
        beforeAll(async () => {
            const regUser = await Personnel.findOne({
                name: "regUser"
            });

            const regUser2 = await Personnel.findOne({
                name: "regUser2"
            });

            let newLeave = new Leave({
                leaveType: "慰假",
                personnel: regUser.id,
                duration: 12
            });
            let newLeave2 = new Leave({
                leaveType: "慰假",
                personnel: regUser2.id,
                duration: 12
            })
            await Promise.all([newLeave.save(), newLeave2.save()]);
            leaveId = newLeave.id;
            leaveId2 = newLeave2.id;
        });

        it("Test: site-admin can retrieve leave info of personnel from same org", async () => {
            const regUser = await Personnel.findOne({
                name: "regUser"
            });
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;
            res = await request(server)
                .get(`/api/leaves/${leaveId}`)
                .set("x-auth-token", token);
            expect(res.statusCode).toBe(200);
            expect(res.body.hasOwnProperty("leaveType"));
        });
        it("Test: site-admin can retrieve leave info of personnel from different org", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;
            res = await request(server)
                .get(`/api/leaves/${leaveId2}`)
                .set("x-auth-token", token);
            expect(res.statusCode).toBe(200);
            expect(res.body.hasOwnProperty("leaveType"));
        });
        it("Test: HR-admin can retrieve leave info of personnel from same org", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server)
                .get(`/api/leaves/${leaveId}`)
                .set("x-auth-token", token);
            expect(res.statusCode).toBe(200);
            expect(res.body.hasOwnProperty("leaveType"));
        });
        it("Test: HR-admin cannot retrieve leave info of personnel from different org", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server)
                .get(`/api/leaves/${leaveId2}`)
                .set("x-auth-token", token);
            expect(res.statusCode).toBe(403);
        });
        it("Test: Regular user can retrieve their own leave info", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server)
                .get(`/api/leaves/${leaveId}`)
                .set("x-auth-token", token);
            expect(res.statusCode).toBe(200);
            expect(res.body.hasOwnProperty("leaveType"));
        });
        it("Test: Regular user cannot retrieve others' leave info", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server)
                .get(`/api/leaves/${leaveId2}`)
                .set("x-auth-token", token);
            expect(res.statusCode).toBe(403);
        });

    });
});

afterAll(async () => {
    await dropTestDB();
    await server.close();
});
