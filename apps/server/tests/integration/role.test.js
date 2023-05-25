"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("@src/app"));
const database_1 = require("@src/lib/database");
const supertest_1 = __importDefault(require("supertest"));
const config_1 = __importDefault(require("@src/lib/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const test_data_1 = require("../config/test-data");
beforeEach((done) => {
    database_1.database.role
        .deleteMany({
        where: {
            NOT: [{ id: database_1.defaultRoles.ADMIN }, { id: database_1.defaultRoles.MEMBER }],
        },
    })
        .then(() => done());
});
afterEach(async () => {
    await database_1.database.role.deleteMany({
        where: {
            NOT: [{ id: database_1.defaultRoles.ADMIN }, { id: database_1.defaultRoles.MEMBER }],
        },
    });
});
describe("GET /roles", () => {
    it("Should return 200 with paginated data", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)()).get("/api/roles");
        expect(response.status).toBe(200);
        expect(response.body.skip).toBeDefined();
        expect(response.body.limit).toBeDefined();
        expect(response.body.count).toBeDefined();
        expect(response.body.data).toEqual(expect.arrayContaining([
            expect.objectContaining({
                name: "admin",
            }),
            expect.objectContaining({
                name: "member",
            }),
        ]));
    });
    it("Should return 200 with admin only", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)()).get("/api/roles?search=admin");
        expect(response.body.data.length).toBe(1);
        expect(response.body.data).toMatchObject([
            {
                name: "admin",
            },
        ]);
    });
});
describe("POST /roles", () => {
    it("Should return 201 with role", async () => {
        const adminPayloadClone = (0, test_data_1.adminPayload)();
        const payload = (0, test_data_1.rolePayload)();
        const admin = await database_1.database.user.create({ data: adminPayloadClone });
        const token = jsonwebtoken_1.default.sign({ id: admin.id }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/roles")
            .set("authorization", `Bearer ${token}`)
            .send(payload);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(payload.name);
        await database_1.database.role.delete({
            where: { id: response.body.id },
        });
        await database_1.database.user.delete({
            where: { id: admin.id },
        });
    });
    it("Should return 400 with role already exists", async () => {
        const adminPayloadClone = (0, test_data_1.adminPayload)();
        const admin = await database_1.database.user.create({ data: adminPayloadClone });
        const token = jsonwebtoken_1.default.sign({ id: admin.id }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/roles")
            .set("authorization", `Bearer ${token}`)
            .send({ name: "admin" });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["name"],
                message: "Role already exists",
            }),
        ]));
        await database_1.database.user.delete({ where: { id: admin.id } });
    });
});
describe("PATCH /roles/:id", () => {
    it("Should return 204", async () => {
        const adminPayloadClone = (0, test_data_1.adminPayload)();
        const payload = (0, test_data_1.rolePayload)();
        const admin = await database_1.database.user.create({ data: adminPayloadClone });
        const role = await database_1.database.role.create({ data: payload });
        const token = jsonwebtoken_1.default.sign({ id: admin.id }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/roles/${role.id}`)
            .set("authorization", `Bearer ${token}`)
            .send({ name: `admin${Math.random()}` });
        expect(response.status).toBe(204);
        await database_1.database.user.delete({ where: { id: admin.id } });
        await database_1.database.role.delete({ where: { id: role.id } });
    });
    it("Should return 400 with role already exists", async () => {
        const adminPayloadClone = (0, test_data_1.adminPayload)();
        const payload = (0, test_data_1.rolePayload)();
        const admin = await database_1.database.user.create({ data: adminPayloadClone });
        const role = await database_1.database.role.create({ data: payload });
        const token = jsonwebtoken_1.default.sign({ id: admin.id }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/roles/${role.id}`)
            .set("authorization", `Bearer ${token}`)
            .send({ name: "admin" });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["name"],
                message: "Role already exists",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
        await database_1.database.user.delete({ where: { id: admin.id } });
        await database_1.database.role.delete({ where: { id: role.id } });
    });
    it("Should return 400 with id is invalid", async () => {
        const adminPayloadClone = (0, test_data_1.adminPayload)();
        const admin = await database_1.database.user.create({ data: adminPayloadClone });
        const token = jsonwebtoken_1.default.sign({ id: admin.id }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/roles/zefz`)
            .set("authorization", `Bearer ${token}`)
            .send({ name: `admin${Math.random()}` });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid id");
        expect(response.body.error).toBe("Bad Request");
        await database_1.database.user.delete({ where: { id: admin.id } });
    });
});
describe("DELETE /roles/:id", () => {
    it("Should return 204", async () => {
        const adminPayloadClone = (0, test_data_1.adminPayload)();
        const payload = (0, test_data_1.rolePayload)();
        const admin = await database_1.database.user.create({ data: adminPayloadClone });
        const role = await database_1.database.role.create({ data: payload });
        const token = jsonwebtoken_1.default.sign({ id: admin.id }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .delete(`/api/roles/${role.id}`)
            .set("authorization", `Bearer ${token}`);
        expect(response.status).toBe(204);
        await database_1.database.user.delete({ where: { id: admin.id } });
    });
    it("Should return 401 with unatuthorized", async () => {
        const adminPayloadClone = (0, test_data_1.adminPayload)();
        const admin = await database_1.database.user.create({ data: adminPayloadClone });
        const token = jsonwebtoken_1.default.sign({ id: admin.id }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .delete(`/api/roles/1`)
            .set("authorization", `Bearer ${token}`);
        expect(response.status).toBe(401);
        await database_1.database.user.delete({ where: { id: admin.id } });
    });
    it("Should return 400 with id is invalid", async () => {
        const adminPayloadClone = (0, test_data_1.adminPayload)();
        const admin = await database_1.database.user.create({ data: adminPayloadClone });
        const token = jsonwebtoken_1.default.sign({ id: admin.id }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .delete(`/api/roles/zefklj`)
            .set("authorization", `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid id");
        expect(response.body.error).toBe("Bad Request");
        await database_1.database.user.delete({ where: { id: admin.id } });
    });
});
