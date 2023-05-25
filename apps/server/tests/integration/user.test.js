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
    id: undefined,
    token: undefined,
    admin: undefined,
};
const user = {
    id: undefined,
    token: undefined,
    user: undefined,
};
beforeAll(async () => {
    const adminPayloadClone = (0, test_data_1.adminPayload)();
    const adminObject = await database_1.database.user.create({
        data: adminPayloadClone,
    });
    const userPayloadClone = (0, test_data_1.userPayload)();
    const userObject = await database_1.database.user.create({
        data: userPayloadClone,
    });
    admin.token = jsonwebtoken_1.default.sign({ id: adminObject.id }, config_1.default.SECRET_ACCESS);
    admin.admin = adminObject;
    admin.id = adminObject.id;
    user.token = jsonwebtoken_1.default.sign({ id: userObject.id }, config_1.default.SECRET_ACCESS);
    user.user = userObject;
    user.id = userObject.id;
});
afterAll(async () => {
    await database_1.database.user.delete({
        where: {
            id: admin.id,
        },
    });
    await database_1.database.user.delete({
        where: {
            id: user.id,
        },
    });
});
describe("GET /users", () => {
    it("Should return 200 with paginated users", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .get("/api/users")
            .set("authorization", `Bearer ${admin.token}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.limit).toBeDefined();
        expect(response.body.skip).toBeDefined();
        expect(response.body.page).toBeDefined();
    });
    it("Should return 401 with unauthorized", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .get("/api/users")
            .set("authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });
});
describe("GET /users/:id", () => {
    it("Should return 200 with user", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .get(`/api/users/${admin.id}`)
            .set("authorization", `Bearer ${admin.token}`);
        expect(response.status).toBe(200);
        expect(response.body.username).toBeDefined();
    });
    it("Should return 400 with invalid id", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .get(`/api/users/x`)
            .set("authorization", `Bearer ${admin.token}`);
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBeDefined();
        expect(response.body.message).toBe("Invalid id");
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 404 with does not exist", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .get(`/api/users/${Math.random()}`)
            .set("authorization", `Bearer ${admin.token}`);
        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBeDefined();
        expect(response.body.message).toBe("User does not exist");
        expect(response.body.error).toBe("Not Found");
    });
    it("Should return 401 with unauthorized", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .get("/api/users/1")
            .set("authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });
});
describe("POST /users", () => {
    it("Should return 201 with user", async () => {
        const payload = (0, test_data_1.userPayload)();
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/users")
            .set("authorization", `bearer ${admin.token}`)
            .send({
            ...payload,
            password: "password",
            password_confirmation: "password",
        });
        expect(response.status).toBe(201);
        expect(response.body.username).toBe(payload.username);
    });
    it("Should return 400 with email and username already taken", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/users")
            .set("authorization", `bearer ${admin.token}`)
            .send({
            ...user.user,
            password: "password",
            password_confirmation: "password",
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["username"],
                message: "Username is already taken",
            }),
            expect.objectContaining({
                path: ["email"],
                message: "Email address is already taken",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 400 with password and password confirmation does not match", async () => {
        const payload = (0, test_data_1.userPayload)();
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/users")
            .set("authorization", `bearer ${admin.token}`)
            .send({
            ...payload,
            password: "password",
            password_confirmation: "password1",
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["password_confirmation"],
                message: "Password and Password confirmation does not exists",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 401 with unauthorized", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/users")
            .set("authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });
});
describe("PATCH /users/:id", () => {
    it("Should return 204", async () => {
        const payload = (0, test_data_1.userPayload)();
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/users/${user.id}`)
            .set("authorization", `bearer ${admin.token}`)
            .send({
            username: payload.username,
        });
        expect(response.status).toBe(204);
    });
    it("Should return 400 with username and email is already taken", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/users/${user.id}`)
            .set("authorization", `bearer ${admin.token}`)
            .send({
            username: admin.admin?.username,
            email: user.user?.email,
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["username"],
                message: "Username is already taken",
            }),
            expect.objectContaining({
                path: ["email"],
                message: "Email address is already taken",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 400 Password and Password confirmation does not match", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/users/${user.id}`)
            .set("authorization", `bearer ${admin.token}`)
            .send({
            password: "password",
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["password_confirmation"],
                message: "Password and Password confirmation does not match",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 401 with unauthorized", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch("/api/users/1")
            .set("authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });
});
describe("DELETE /users/:id", () => {
    it("Should return 204", async () => {
        const userPayloadClone = (0, test_data_1.userPayload)();
        const newUser = await database_1.database.user.create({
            data: userPayloadClone,
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/users/${newUser.id}`)
            .set("authorization", `bearer ${admin.token}`);
        expect(response.status).toBe(204);
    });
    it("Should return 401 with unauthorized", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .delete("/api/users/1")
            .set("authorization", `Bearer ${user.token}`);
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });
});
