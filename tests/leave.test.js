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

describe("Leave API endpoints", () => {
    describe("Leave addition tests", () => {
        afterEach(async () => await Leave.deleteMany({}));
        it("Test: site-admin can add leave for personnel of same organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;
            const personnel = await Personnel.findOne({
                name: "regUser"
            });
            const org = await Org.findOne({
                name: "成功嶺"
            });
            res = await request(server)
                .post("/api/leaves")
                .set("x-auth-token", token)
                .send({
                    org: org.id,
                    leaveType: "例假",
                    personnel: personnel.id,
                    scheduled: false,
                    duration: 24
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("leaveType"));
        });
        it("Test: site-admin can add leave for personnel of different organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;
            const personnel = await Personnel.findOne({
                email: "reguser2@gmail.com"
            });
            const org = await Org.findOne({
                name: "台糖公司"
            });
            res = await request(server)
                .post("/api/leaves")
                .set("x-auth-token", token)
                .send({
                    org: org.id,
                    leaveType: "例假",
                    personnel: personnel.id,
                    scheduled: false,
                    duration: 24
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("leaveType"));
            expect(res.body['leaveType']).toBe("例假");
        });
        it("Test: HR-admin can add leave for personnel of same organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            const personnel = await Personnel.findOne({
                email: "reguser@gmail.com"
            });
            const org = await Org.findOne({
                name: "成功嶺"
            });
            res = await request(server)
                .post("/api/leaves")
                .set("x-auth-token", token)
                .send({
                    org: org.id,
                    leaveType: "例假",
                    personnel: personnel.id,
                    scheduled: false,
                    duration: 24
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("leaveType"));
            expect(res.body['leaveType']).toBe("例假");
        });
        it("Test leave addition with scheduled and original dates", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            const personnel = await Personnel.findOne({
                email: "reguser@gmail.com"
            });
            const org = await Org.findOne({
                name: "成功嶺"
            });
            const scheduledDate = new Date(2019, 4, 30);
            const originalDate = new Date(2019, 0, 2);
            res = await request(server)
                .post("/api/leaves")
                .set("x-auth-token", token)
                .send({
                    org: org.id,
                    leaveType: "例假",
                    personnel: personnel.id,
                    scheduled: true,
                    duration: 24,
                    scheduledDate: scheduledDate,
                    originalDate: originalDate
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.hasOwnProperty("leaveType"));
            expect(res.body['leaveType']).toBe("例假");
            expect(res.body.scheduledDate).toBe(scheduledDate.toJSON());
            expect(res.body.originalDate).toBe(originalDate.toJSON());
        });
        it("Test: HR-admin cannot add leave for personnel of different organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            const personnel = await Personnel.findOne({
                email: "reguser2@gmail.com"
            });
            const org = await Org.findOne({
                name: "台糖公司"
            });
            res = await request(server)
                .post("/api/leaves")
                .set("x-auth-token", token)
                .send({
                    org: org.id,
                    leaveType: "例假",
                    personnel: personnel.id,
                    scheduled: false,
                    duration: 24
                });
            expect(res.statusCode).toEqual(401);
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
            const org1 = await Org.findOne({
                name: "成功嶺"
            });
            const org2 = await Org.findOne({
                name: "台糖公司"
            });

            let newLeave = new Leave({
                org: org1.id,
                leaveType: "慰假",
                personnel: regUser.id,
                duration: 12
            });
            let newLeave2 = new Leave({
                org: org2.id,
                leaveType: "慰假",
                personnel: regUser2.id,
                duration: 12
            })
            await Promise.all([newLeave.save(), newLeave2.save()]);
            leaveId = newLeave.id;
            leaveId2 = newLeave2.id;
        });
        afterAll(async () => await Leave.deleteMany({}));
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
        it("site-admin can retrieve leave info of personnel from different org", async () => {
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
        it("Attempting to retrieve non-existant leave results in an error", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;
            res = await request(server)
                .get('/api/leaves/507f191e810c19729de860ea')
                .set("x-auth-token", token);
            expect(res.statusCode).toBe(400);
            expect(res.body.msg).toBe("Resource doesn't exist");
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

    describe("Leave modification tests", () => {
        let leave1Id, leave2Id;
        beforeEach(async () => {
            const regUser = await Personnel.findOne({
                name: "regUser"
            });

            const regUser2 = await Personnel.findOne({
                name: "regUser2"
            });
            const org1 = await Org.findOne({
                name: "成功嶺"
            });
            const org2 = await Org.findOne({
                name: "台糖公司"
            });

            let newLeave = new Leave({
                org: org1.id,
                leaveType: "慰假",
                personnel: regUser.id,
                scheduledDate: new Date("2019-11-02"),
                scheduled: true,
                duration: 12
            });
            let newLeave2 = new Leave({
                org: org2.id,
                leaveType: "慰假",
                personnel: regUser2.id,
                scheduledDate: new Date("2019-11-03"),
                scheduled: true,
                duration: 12
            })
            await Promise.all([newLeave.save(), newLeave2.save()]);
            leave1Id = newLeave.id;
            leave2Id = newLeave2.id;
        });

        afterEach(async () => await Leave.deleteMany({}));

        it("Site admin can modify leave from same organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;

            res = await request(server).put(`/api/leaves/${leave1Id}`)
                                       .set('x-auth-token', token)
                                       .send({
                                            leaveType: "慰假",
                                            scheduledDate: "2019-11-05"
                                       });
            const personnel = await Personnel.findOne({
                email: "reguser@gmail.com"
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.personnel).toEqual(personnel.id);
            const newScheduledDate = new Date(res.body.scheduledDate);
            expect(newScheduledDate.getFullYear()).toBe(2019);
            expect(newScheduledDate.getMonth()).toBe(10);
            expect(newScheduledDate.getDate()).toBe(5);
            expect(res.body.leaveType).toEqual("慰假");
        });
        it("Site admin can modify leave from different organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;

            res = await request(server).put(`/api/leaves/${leave2Id}`)
                                       .set('x-auth-token', token)
                                       .send({
                                            leaveType: "慰假",
                                            scheduledDate: "2019-11-05"
                                       });
            const personnel = await Personnel.findOne({
                email: "reguser2@gmail.com"
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.personnel).toEqual(personnel.id);
            const newScheduledDate = new Date(res.body.scheduledDate);
            expect(newScheduledDate.getFullYear()).toBe(2019);
            expect(newScheduledDate.getMonth()).toBe(10);
            expect(newScheduledDate.getDate()).toBe(5);
            expect(res.body.leaveType).toEqual("慰假");
        });
        it("HR-admin can modify leave from same organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            res = await request(server).put(`/api/leaves/${leave1Id}`)
                                       .set('x-auth-token', token)
                                       .send({
                                            leaveType: "慰假",
                                            scheduledDate: "2019-11-05"
                                       });
            const personnel = await Personnel.findOne({
                email: "reguser@gmail.com"
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.personnel).toEqual(personnel.id);
            const newScheduledDate = new Date(res.body.scheduledDate);
            expect(newScheduledDate.getFullYear()).toBe(2019);
            expect(newScheduledDate.getMonth()).toBe(10);
            expect(newScheduledDate.getDate()).toBe(5);
            expect(res.body.leaveType).toEqual("慰假");
        });
        it("HR-admin cannot modify leave from different organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            res = await request(server).put(`/api/leaves/${leave2Id}`)
                                       .set('x-auth-token', token)
                                       .send({
                                            leaveType: "慰假",
                                            scheduledDate: "2019-11-05"
                                       });
            expect(res.statusCode).toBe(403);
        });
        it("Regular user cannot modify own leave", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            res = await request(server).put(`/api/leaves/${leave1Id}`)
                                       .set('x-auth-token', token)
                                       .send({
                                            leaveType: "慰假",
                                            scheduledDate: "2019-11-05"
                                       });
            expect(res.statusCode).toBe(403);
        });
        it("Regular user cannot modify others' leave", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            res = await request(server).put(`/api/leaves/${leave2Id}`)
                                       .set('x-auth-token', token)
                                       .send({
                                            leaveType: "慰假",
                                            scheduledDate: "2019-11-05"
                                       });
            expect(res.statusCode).toBe(403);
        });

    });
    describe("Leave deletion tests", () => {
        let leave1Id, leave2Id;
        beforeEach(async () => {
            const regUser = await Personnel.findOne({
                name: "regUser"
            });

            const regUser2 = await Personnel.findOne({
                name: "regUser2"
            });
            const org1 = await Org.findOne({
                name: "成功嶺"
            });
            const org2 = await Org.findOne({
                name: "台糖公司"
            });

            let newLeave = new Leave({
                org: org1.id,
                leaveType: "例假",
                personnel: regUser.id,
                scheduledDate: new Date("2019-11-02"),
                scheduled: true,
                duration: 12
            });
            let newLeave2 = new Leave({
                org: org2.id,
                leaveType: "例假",
                personnel: regUser2.id,
                scheduledDate: new Date("2019-11-03"),
                scheduled: true,
                duration: 12
            })
            await Promise.all([newLeave.save(), newLeave2.save()]);
            leave1Id = newLeave.id;
            leave2Id = newLeave2.id;
        });

        afterEach(async () => await Leave.deleteMany({}));

        it("Site admin can delete leave from same organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;

            res = await request(server).delete(`/api/leaves/${leave1Id}`)
                                       .set('x-auth-token', token)
            const personnel = await Personnel.findOne({
                email: "reguser@gmail.com"
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.personnel).toEqual(personnel.id);
            const newScheduledDate = new Date(res.body.scheduledDate);
            expect(newScheduledDate.getFullYear()).toBe(2019);
            expect(newScheduledDate.getMonth()).toBe(10);
            expect(newScheduledDate.getDate()).toBe(2);
            expect(res.body.leaveType).toEqual("例假");
        });
        it("Site admin can delete leave from different organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;

            res = await request(server).delete(`/api/leaves/${leave2Id}`)
                                       .set('x-auth-token', token)
            const personnel = await Personnel.findOne({
                email: "reguser2@gmail.com"
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.personnel).toEqual(personnel.id);
            const newScheduledDate = new Date(res.body.scheduledDate);
            expect(newScheduledDate.getFullYear()).toBe(2019);
            expect(newScheduledDate.getMonth()).toBe(10);
            expect(newScheduledDate.getDate()).toBe(3);
            expect(res.body.leaveType).toEqual("例假");
        });
        it("HR-admin can delete leave from same organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            res = await request(server).delete(`/api/leaves/${leave1Id}`).set('x-auth-token', token);
            const personnel = await Personnel.findOne({
                email: "reguser@gmail.com"
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.personnel).toEqual(personnel.id);
            const newScheduledDate = new Date(res.body.scheduledDate);
            expect(newScheduledDate.getFullYear()).toBe(2019);
            expect(newScheduledDate.getMonth()).toBe(10);
            expect(newScheduledDate.getDate()).toBe(2);
            expect(res.body.leaveType).toEqual("例假");
        });
        it("HR-admin cannot delete leave from different organization", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            res = await request(server).delete(`/api/leaves/${leave2Id}`)
                                       .set('x-auth-token', token)
            expect(res.statusCode).toBe(403);
        });
        it("Regular user cannot delete own leave", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            res = await request(server).delete(`/api/leaves/${leave1Id}`)
                                       .set('x-auth-token', token)
            expect(res.statusCode).toBe(403);
        });
        it("Regular user cannot delete others' leave", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;

            res = await request(server).delete(`/api/leaves/${leave2Id}`)
                                       .set('x-auth-token', token)
            expect(res.statusCode).toBe(403);
        });
    });

    describe("Leave query tests", () => {
        beforeAll(async () => {
            await Leave.deleteMany({});
            const regUser = await Personnel.findOne({
                name: "regUser"
            });

            const regUser2 = await Personnel.findOne({
                name: "regUser2"
            });
            const org1 = await Org.findOne({
                name: "成功嶺"
            });
            const org2 = await Org.findOne({
                name: "台糖公司"
            });
            let newLeavePromises = []; 
            // 3 leaves in org 1 without scheduled dates
            for (let i = 0; i < 3; i++) {
                let newLeave = new Leave({
                    org: org1.id,
                    leaveType: "例假",
                    personnel: regUser.id,
                    scheduled: false,
                    duration: 12
                });
                newLeavePromises.push(newLeave.save());
            }
            // 4 leaves in org 1 scheduled in March 2019
            for (let i = 0; i < 4; i++) {
                let newLeave = new Leave({
                    org: org1.id,
                    leaveType: "例假",
                    personnel: regUser.id,
                    scheduled: true,
                    scheduledDate: new Date("2019-03-15"),
                    duration: 12
                });
                newLeavePromises.push(newLeave.save());
            }
            // 6 leaves in org 1 (regUser1) scheduled in Dec 2018
            for (let i = 0; i < 6; i++) {
                let newLeave = new Leave({
                    org: org1.id,
                    leaveType: "例假",
                    personnel: regUser.id,
                    scheduled: true,
                    scheduledDate: new Date("2018-12-15"),
                    duration: 12
                });
                newLeavePromises.push(newLeave.save());
            }
            // 6 leaves in org 1 scheduled in April 2018
            for (let i = 0; i < 6; i++) {
                let newLeave = new Leave({
                    org: org1.id,
                    leaveType: "例假",
                    personnel: regUser.id,
                    scheduled: true,
                    scheduledDate: new Date("2018-04-15"),
                    duration: 12
                });
                newLeavePromises.push(newLeave.save());
            }
            // 6 leaves in org 2 (regUser2) scheduled in Apr 2018
            for (let i = 0; i < 6; i++) {
                let newLeave = new Leave({
                    org: org2.id,
                    leaveType: "例假",
                    personnel: regUser2.id,
                    scheduled: true,
                    scheduledDate: new Date("2018-04-15"),
                    duration: 12
                });
                newLeavePromises.push(newLeave.save());
            }
            await Promise.all(newLeavePromises);
        });

        it("Site-admin can get all leaves", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);
            let allLeaves = await Leave.find({});
            expect(res.body.leaves.length).toBe(allLeaves.length);
        });

        it("Site-admin can filter by year", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves?year=2018')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);

            expect(res.statusCode).toBe(200);
            for (let leave of res.body.leaves) {
                const scheduledDate = new Date(leave.scheduledDate);
                expect(scheduledDate.getFullYear()).toBe(2018);
            }
        });
        it("Site-admin can filter by year and month", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves?year=2018&month=4')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);

            expect(res.statusCode).toBe(200);
            for (let leave of res.body.leaves) {
                const scheduledDate = new Date(leave.scheduledDate);
                expect(scheduledDate.getFullYear()).toBe(2018);
                expect(scheduledDate.getMonth()).toBe(3);
            }
        });
        it("Site-admin can filter by year, month and day", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "chrisshyi13@gmail.com",
                    password: "Nash1234@"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves?year=2018&month=4&day=15')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);

            expect(res.statusCode).toBe(200);
            expect(res.body.leaves.length > 0);
            for (let leave of res.body.leaves) {
                const scheduledDate = new Date(leave.scheduledDate);
                expect(scheduledDate.getFullYear()).toBe(2018);
                expect(scheduledDate.getMonth()).toBe(3);
                expect(scheduledDate.getDate()).toBe(15);
            }
        });
        it("HR-admin can get all leaves of org", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);

            let org = await Org.findOne({
                name: "成功嶺"
            });
            
            let orgLeaves = await Leave.find({
                org: org.id,
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.leaves.length).toBe(orgLeaves.length);
        });
        it("HR-admin can filter by year", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves?year=2018')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);

            let org = await Org.findOne({
                name: "成功嶺"
            });

            expect(res.statusCode).toBe(200);
            for (let leave of res.body.leaves) {
                const scheduledDate = new Date(leave.scheduledDate);
                expect(scheduledDate.getFullYear()).toBe(2018);
                expect(leave.org).toEqual(org.id.toString());
            }
        });
        it("HR-admin can filter by year and month", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves?year=2018&month=4')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);

            let org = await Org.findOne({
                name: "成功嶺"
            });

            expect(res.statusCode).toBe(200);
            for (let leave of res.body.leaves) {
                const scheduledDate = new Date(leave.scheduledDate);
                expect(scheduledDate.getFullYear()).toBe(2018);
                expect(scheduledDate.getMonth()).toBe(3);
                expect(leave.org).toEqual(org.id.toString());
            }
        });
        it("HR-admin can retrieve December leaves", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves?year=2018&month=12')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);

            let org = await Org.findOne({
                name: "成功嶺"
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.leaves.length > 0);
            for (let leave of res.body.leaves) {
                const scheduledDate = new Date(leave.scheduledDate);
                expect(scheduledDate.getFullYear()).toBe(2018);
                expect(scheduledDate.getMonth()).toBe(11);
                expect(leave.org).toEqual(org.id.toString());
            }
        });
        it("HR-admin can retrieve leave on a day in December", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves?year=2018&month=12&day=15')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);

            let org = await Org.findOne({
                name: "成功嶺"
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.leaves.length > 0);
            for (let leave of res.body.leaves) {
                const scheduledDate = new Date(leave.scheduledDate);
                expect(scheduledDate.getFullYear()).toBe(2018);
                expect(scheduledDate.getMonth()).toBe(11);
                expect(scheduledDate.getDate()).toBe(15);
                expect(leave.org).toEqual(org.id.toString());
            }
        });
        it("HR-admin can filter by year, month and day", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves?year=2018&month=4&day=15')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);

            let org = await Org.findOne({
                name: "成功嶺"
            });

            expect(res.statusCode).toBe(200);
            for (let leave of res.body.leaves) {
                const scheduledDate = new Date(leave.scheduledDate);
                expect(scheduledDate.getFullYear()).toBe(2018);
                expect(scheduledDate.getMonth()).toBe(3);
                expect(scheduledDate.getDate()).toBe(15);
                expect(leave.org).toEqual(org.id.toString());
            }
        });
        it("Regular user can get their own leaves", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);

            let personnel = await Personnel.findOne({
                email: "reguser@gmail.com"
            });

            let userLeaves = await Leave.find({
                personnel: personnel.id
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.leaves.length).toBe(userLeaves.length);
        });
        it("Regular user can filter by year", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "reguser@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves?year=2018')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);

            let personnel = await Personnel.findOne({
                email: "reguser@gmail.com"
            });

            expect(res.statusCode).toBe(200);
            for (let leave of res.body.leaves) {
                const scheduledDate = new Date(leave.scheduledDate);
                expect(scheduledDate.getFullYear()).toBe(2018);
                expect(leave.personnel["_id"]).toEqual(personnel.id.toString());
            }
        });
        it("Regular user can filter by year and month", async () => {
            let res = await request(server)
                .post("/api/auth/")
                .send({
                    email: "brad-trav@gmail.com",
                    password: "123456"
                });
            const token = res.body.token;
            res = await request(server).get('/api/leaves?year=2018&month=4')
                                       .set('x-auth-token', token); 
            expect(res.statusCode).toBe(200);

            let personnel = await Personnel.findOne({
                email: "reguser@gmail.com"
            });


            expect(res.statusCode).toBe(200);
            for (let leave of res.body.leaves) {
                const scheduledDate = new Date(leave.scheduledDate);
                expect(scheduledDate.getFullYear()).toBe(2018);
                expect(scheduledDate.getMonth()).toBe(3);
                expect(leave.personnel["_id"]).toEqual(personnel.id.toString());
            }
        });
    });
});

afterAll(async () => {
    await dropTestDB(); 
    server.close();
});
