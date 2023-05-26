"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("@src/app"));
const database_1 = require("@src/lib/database");
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("@src/lib/config"));
const test_data_1 = require("../config/test-data");
const admin = {
    admin: undefined,
    token: undefined,
};
const user = {
    user: undefined,
    token: undefined,
};
beforeAll(async () => {
    const adminPayloadClone = (0, test_data_1.adminPayload)();
    const userPayloadClone = (0, test_data_1.userPayload)();
    const adminObject = await database_1.database.user.create({
        data: adminPayloadClone,
    });
    const userObject = await database_1.database.user.create({
        data: userPayloadClone,
    });
    admin.admin = adminObject;
    admin.token = jsonwebtoken_1.default.sign({ id: adminObject.id }, config_1.default.SECRET_ACCESS);
    user.user = userObject;
    user.token = jsonwebtoken_1.default.sign({ id: userObject.id }, config_1.default.SECRET_ACCESS);
});
afterAll(async () => {
    await database_1.database.user.delete({
        where: { id: admin.admin?.id },
    });
    await database_1.database.user.delete({
        where: { id: user.user?.id },
    });
});
describe("GET /tags", () => {
    it("Should return 200 with paginated tags", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .get("/api/tags")
            .set("authorization", `Bearer ${admin.token}`);
        expect(response.status).toBe(200);
        expect(response.body.limit).toBeDefined();
        expect(response.body.skip).toBeDefined();
        expect(response.body.page).toBeDefined();
        expect(response.body.count).toBeDefined();
        expect(response.body.data).toBeDefined();
    });
});
describe("POST /tags", () => {
    it("Should return 201 with tag", async () => {
        const payload = (0, test_data_1.tagPaylaod)();
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/tags")
            .set("authorization", `Bearer ${admin.token}`)
            .send(payload);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(payload.name);
        await database_1.database.tag.delete({
            where: {
                id: response.body.id,
            },
        });
    });
    it("Should return 400 with tag already exists", async () => {
        const payload = (0, test_data_1.tagPaylaod)();
        const tag = await database_1.database.tag.create({
            data: payload,
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/tags")
            .set("authorization", `Bearer ${admin.token}`)
            .send(payload);
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["name"],
                message: "Tag is already taken",
            }),
        ]));
        await database_1.database.tag.delete({
            where: {
                id: tag.id,
            },
        });
    });
    it("Should return 401 with Unauthorized", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/tags")
            .set("authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(401);
    });
});
describe("PATCH /tags/:id", () => {
    it("Should return 204", async () => {
        const payload = (0, test_data_1.tagPaylaod)();
        const tag = await database_1.database.tag.create({ data: payload });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/tags/${tag.id}`)
            .set("authorization", `Bearer ${admin.token}`)
            .send((0, test_data_1.tagPaylaod)());
        expect(response.status).toBe(204);
        await database_1.database.tag.delete({
            where: {
                id: tag.id,
            },
        });
    });
    it("Should return 400 with tag already exists", async () => {
        const payload = (0, test_data_1.tagPaylaod)();
        const tag = await database_1.database.tag.create({ data: payload });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/tags/${tag.id}`)
            .set("authorization", `Bearer ${admin.token}`)
            .send(payload);
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.error).toBe("Bad Request");
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["name"],
                message: "Tag is already taken",
            }),
        ]));
        await database_1.database.tag.delete({
            where: {
                id: tag.id,
            },
        });
    });
    it("Should return 400 with tag already taken", async () => {
        const payload = (0, test_data_1.tagPaylaod)();
        const tag = await database_1.database.tag.create({ data: payload });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/tags/${tag.id}`)
            .set("authorization", `Bearer ${admin.token}`)
            .send(payload);
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.error).toBe("Bad Request");
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["name"],
                message: "Tag is already taken",
            }),
        ]));
        await database_1.database.tag.delete({
            where: {
                id: tag.id,
            },
        });
    });
    it("Should return 401 with Unauthorized", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch("/api/tags/1")
            .set("authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(401);
    });
});
describe("DELETE /tags/:id", () => {
    it("Should return 204", async () => {
        const payload = (0, test_data_1.tagPaylaod)();
        const tag = await database_1.database.tag.create({ data: payload });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .delete(`/api/tags/${tag.id}`)
            .set("authorization", `Bearer ${admin.token}`);
        expect(response.status).toBe(204);
    });
    it("Should return 400 with tag does not exists", async () => {
        const payload = (0, test_data_1.tagPaylaod)();
        const tag = await database_1.database.tag.create({ data: payload });
        await database_1.database.tag.delete({
            where: {
                id: tag.id,
            },
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .delete(`/api/tags/${tag.id}`)
            .set("authorization", `Bearer ${admin.token}`);
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["id"],
                message: "Tag does not exist",
            }),
        ]));
    });
    it("Should return 401 with Unauthorized", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .delete("/api/tags/1")
            .set("authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(401);
    });
});
