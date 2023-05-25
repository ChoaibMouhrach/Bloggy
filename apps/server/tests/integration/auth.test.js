"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("@src/app"));
const database_1 = require("@src/lib/database");
const config_1 = __importDefault(require("@src/lib/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const test_data_1 = require("../config/test-data");
jest.mock("@src/lib/mail", () => ({
    sendMail: () => Promise.resolve(),
}));
describe("POST /sign-in", () => {
    it("Should return 200 with user info, accessToken and refreshToken", async () => {
        const user = await database_1.database.user.create({
            data: (0, test_data_1.userPayload)(),
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/sign-in")
            .send({ email: user.email, password: "password" });
        expect(response.status).toBe(200);
        expect(response.body.user.email).toBe(user.email);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
    it("Should return 400 with email and password are required", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)()).post("/api/sign-in");
        expect(response.status).toBe(400);
        expect(response.body.message).toMatchObject([
            {
                path: ["email"],
                message: "Required",
            },
            {
                path: ["password"],
                message: "Required",
            },
        ]);
    });
    it("Should return 400 with email address or password does not exist within out database", async () => {
        const user = await database_1.database.user.create({
            data: (0, test_data_1.userPayload)(),
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/sign-in")
            .send({ email: user.email, password: "password10" });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toMatchObject([
            { path: ["email"], message: "Email address or password is not correct" },
        ]);
        expect(response.body.error).toBe("Bad Request");
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
});
describe("POST /sign-up", () => {
    it("Should return 200 with user info and tokens", async () => {
        const payload = (0, test_data_1.userPayload)();
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/sign-up")
            .send({
            ...payload,
            password: "password",
            password_confirmation: "password",
        });
        expect(response.status).toBe(201);
        expect(response.body.user.email).toBe(payload.email);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    });
    it("Should return 400 with every field is required", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)()).post("/api/sign-up");
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                message: "Required",
                path: ["email"],
            }),
            expect.objectContaining({
                message: "Required",
                path: ["password"],
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 400 with email is already taken", async () => {
        const payload = (0, test_data_1.userPayload)();
        await database_1.database.user.create({ data: payload });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/sign-up")
            .send({
            ...payload,
            password: "password",
            password_confirmation: "password",
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                message: "Email address is already taken",
                path: ["email"],
            }),
            expect.objectContaining({
                message: "Username is already taken",
                path: ["username"],
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
    });
});
describe("POST /refresh", () => {
    it("Should return 200 with tokens", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_REFRESH);
        await database_1.database.refreshToken.create({
            data: {
                token,
                userId: user.id,
            },
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/refresh")
            .set({
            authorization: `Bearer ${token}`,
        });
        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
    it("Should return 401 with unauthorized when token is not valid", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/refresh")
            .set({
            authorization: `Bearer ${2000}`,
        });
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toBe("jwt malformed");
        expect(response.body.error).toBe("Unauthorized");
    });
    it("Should return 401 with unauthorized token expires", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_REFRESH, {
            expiresIn: 0,
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/refresh")
            .set({
            authorization: `Bearer ${token}`,
        });
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toBe("jwt expired");
        expect(response.body.error).toBe("Unauthorized");
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
});
describe("POST /forgot-password", () => {
    it("Should return 200 with If the email is present in our database, a corresponding email will be sent to it. when email exists", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/forgot-password")
            .send({ email: user.email });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("If the email is present in our database, a corresponding email will be sent to it.");
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
    it("Should return 200 with If the email is present in our database, a corresponding email will be sent to it. when does not exists", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/forgot-password")
            .send({ email: "test@test.com" });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("If the email is present in our database, a corresponding email will be sent to it.");
    });
    it("Should return 400 with email required", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)()).post("/api/forgot-password");
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["email"],
                message: "Required",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
    });
});
describe("POST /send-confirmation-email", () => {
    it("Should return 204", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/send-confirmation-email")
            .set({
            authorization: `Bearer ${token}`,
        });
        expect(response.status).toBe(204);
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
    it("Should return 400 with user already verified", async () => {
        const user = await database_1.database.user.create({
            data: {
                ...(0, test_data_1.userPayload)(),
                verifiedAt: new Date(),
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/send-confirmation-email")
            .set({
            authorization: `Bearer ${token}`,
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("Already verified");
        expect(response.body.error).toBe("Bad Request");
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
});
describe("POST /reset-password/:token", () => {
    it("Should return 204", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_FORGOT_PASSWORD);
        await database_1.database.forgotPasswordToken.create({
            data: {
                token,
                userId: user.id,
            },
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/reset-password/${token}`)
            .send({
            password: "password",
            password_confirmation: "password",
        });
        expect(response.status).toBe(204);
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
    it("Should return 400 with jwt expired", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_FORGOT_PASSWORD, {
            expiresIn: 0,
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/reset-password/${token}`)
            .send({
            password: "password",
            password_confirmation: "password",
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("jwt expired");
        expect(response.body.error).toBe("Bad Request");
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
    it("Should return 401 with User does not exist", async () => {
        const payload = (0, test_data_1.userPayload)();
        // user
        const user = await database_1.database.user.create({ data: payload });
        // token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_FORGOT_PASSWORD);
        // delete user
        await database_1.database.user.delete({ where: { id: user.id } });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/reset-password/${token}`)
            .send({
            password: "password",
            password_confirmation: "password",
        });
        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toBe("User does not exist");
        expect(response.body.error).toBe("Not Found");
    });
    it("Should return 400 Token is not valid when token does not exists in database", async () => {
        // user
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        // token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_FORGOT_PASSWORD);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/reset-password/${token}`)
            .send({
            password: "password",
            password_confirmation: "password",
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("Token is not valid");
        expect(response.body.error).toBe("Bad Request");
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
});
describe("POST /confirm-email/:token", () => {
    it("Should return 204", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_CONFIRM_EMAIL);
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_ACCESS);
        await database_1.database.confirmEmailToken.create({
            data: {
                token,
                userId: user.id,
            },
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/confirm-email/${token}`)
            .set("authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(204);
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
    it("Should return 400 with jwt expired", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_CONFIRM_EMAIL, {
            expiresIn: 0,
        });
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_ACCESS);
        await database_1.database.confirmEmailToken.create({
            data: {
                token,
                userId: user.id,
            },
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/confirm-email/${token}`)
            .set("authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("jwt expired");
        expect(response.body.error).toBe("Bad Request");
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
    it("Should return 404 with User does not exist", async () => {
        // user
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        // token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_CONFIRM_EMAIL);
        // accessToken
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_ACCESS);
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/confirm-email/${token}`)
            .set("authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.message).toBe("User does not exists");
        expect(response.body.error).toBe("Unauthorized");
    });
    it("Should return 400 Token is not valid when token does not exists in database", async () => {
        // user
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        // token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_CONFIRM_EMAIL);
        // accessToken
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/confirm-email/${token}`)
            .set("authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("Token is not valid");
        expect(response.body.error).toBe("Bad Request");
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
});
// get
describe("GET /me", () => {
    it("Should return 200 with user", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .get("/api/me")
            .set({
            authorization: `Bearer ${token}`,
        });
        expect(response.status).toBe(200);
        expect(response.body.email).toBe(user.email);
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
});
// patch
describe("PATCH /me", () => {
    it("Should return 204", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
        }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch("/api/me")
            .set("authorization", `Bearer ${accessToken}`)
            .send({
            username: "john.junior",
        });
        expect(response.status).toBe(204);
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
    it("Should return 400 with username is already taken", async () => {
        const payload = (0, test_data_1.userPayload)();
        const user = await database_1.database.user.create({ data: payload });
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
        }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch("/api/me")
            .set("authorization", `Bearer ${accessToken}`)
            .send({
            username: payload.username,
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["username"],
                message: "Username is already taken",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
});
describe("PATCH /change-password", () => {
    it("Should return 204", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
        }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch("/api/change-password")
            .set("authorization", `Bearer ${accessToken}`)
            .send({
            password: "password",
            newPassword: "password10",
            password_confirmation: "password10",
        });
        expect(response.status).toBe(204);
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
    it("Should return 400 with password is not correct", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
        }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch("/api/change-password")
            .set("authorization", `Bearer ${accessToken}`)
            .send({
            password: "password10",
            newPassword: "password10",
            password_confirmation: "password10",
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["password"],
                message: "Password is not correct",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
    it("Should return 400 with New password and password confirmation does not match", async () => {
        const user = await database_1.database.user.create({ data: (0, test_data_1.userPayload)() });
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
        }, config_1.default.SECRET_ACCESS);
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch("/api/change-password")
            .set("authorization", `Bearer ${accessToken}`)
            .send({
            password: "password",
            newPassword: "password10",
            password_confirmation: "password100",
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["password_confirmation"],
                message: "New Password and Password confirmation does not match",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
});
describe("POST /sign-out", () => {
    it("Should return 204", async () => {
        const payload = (0, test_data_1.userPayload)();
        const user = await database_1.database.user.create({ data: payload });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.default.SECRET_REFRESH);
        await database_1.database.refreshToken.create({
            data: {
                token,
                userId: user.id,
            },
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post("/api/sign-out")
            .set("authorization", `Bearer ${token}`);
        expect(response.status).toBe(204);
        await database_1.database.user.delete({
            where: {
                id: user.id,
            },
        });
    });
});
