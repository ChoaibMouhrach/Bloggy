"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("@src/app"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const database_1 = require("@src/lib/database");
const config_1 = __importDefault(require("@src/lib/config"));
const test_data_1 = require("../config/test-data");
let account = {
    user: {
        token: undefined,
        user: undefined,
    },
    admin: {
        user: undefined,
        token: undefined,
    },
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
    account = {
        admin: {
            user: adminObject,
            token: jsonwebtoken_1.default.sign({ id: adminObject.id }, config_1.default.SECRET_ACCESS),
        },
        user: {
            user: userObject,
            token: jsonwebtoken_1.default.sign({ id: userObject.id }, config_1.default.SECRET_ACCESS),
        },
    };
});
afterAll(async () => {
    await database_1.database.user.delete({
        where: {
            id: account.admin.user?.id,
        },
    });
    await database_1.database.user.delete({
        where: {
            id: account.user.user?.id,
        },
    });
});
describe("GET /posts", () => {
    it("Should return 200 with paginated posts", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)()).get("/api/posts");
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.limit).toBeDefined();
        expect(response.body.skip).toBeDefined();
    });
});
const generateTag = async () => {
    return await database_1.database.tag.create({ data: (0, test_data_1.tagPaylaod)() });
};
const generatePost = async () => {
    const tag = await generateTag();
    const post = await database_1.database.post.create({
        data: { ...(0, test_data_1.postPayload)(), tags: { connect: [{ id: tag.id }] } },
    });
    return {
        post,
        tag,
    };
};
describe("GET /posts/:id", () => {
    it("Should return 200 with post", async () => {
        const { post, tag } = await generatePost();
        const response = await (0, supertest_1.default)((0, app_1.default)()).get(`/api/posts/${post.id}`);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(post.title);
        // cleanup
        await database_1.database.tag.delete({
            where: {
                id: tag.id,
            },
        });
        await database_1.database.post.delete({
            where: {
                id: post.id,
            },
        });
    });
    it("Should return 400 with Invalid id", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)()).get(`/api/posts/xx`);
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid id");
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 404 with post does not exist", async () => {
        const { post, tag } = await generatePost();
        // cleanup
        await database_1.database.tag.delete({
            where: {
                id: tag.id,
            },
        });
        await database_1.database.post.delete({
            where: {
                id: post.id,
            },
        });
        const response = await (0, supertest_1.default)((0, app_1.default)()).get(`/api/posts/${post.id}`);
        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toBe("Post does not exist");
        expect(response.body.error).toBe("Not Found");
    });
});
describe("POST /posts", () => {
    it("Should return 201 with post", async () => {
        const tag = await generateTag();
        const post = (0, test_data_1.postPayload)();
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/posts`)
            .set("authorization", `Bearer ${account.admin?.token}`)
            .send({
            ...post,
            tags: [tag.id],
        });
        expect(response.status).toBe(201);
        expect(response.body.title).toBe(post.title);
        // cleanup
        await database_1.database.tag.delete({
            where: {
                id: tag.id,
            },
        });
        await database_1.database.post.delete({
            where: {
                id: response.body.id,
            },
        });
    });
    it("Should return 400 with title required", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/posts`)
            .set("authorization", `Bearer ${account.admin.token}`);
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["title"],
                message: "Required",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 400 with tag does not exist", async () => {
        const tag = await generateTag();
        await database_1.database.tag.delete({ where: { id: tag.id } });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/posts`)
            .set("authorization", `Bearer ${account.admin.token}`)
            .send({
            ...(0, test_data_1.postPayload)(),
            tags: [tag.id],
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: expect.arrayContaining(["tags"]),
                message: "Tag does not exists",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 400 with at least one tag is required", async () => {
        const tag = await generateTag();
        await database_1.database.tag.delete({ where: { id: tag.id } });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/posts`)
            .set("authorization", `Bearer ${account.admin.token}`)
            .send({
            ...(0, test_data_1.postPayload)(),
            tags: [],
        });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: expect.arrayContaining(["tags"]),
                message: "At least one tag is required",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 401", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .post(`/api/posts`)
            .set("authorization", `Bearer ${account.user.token}`);
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });
});
describe("PATCH /posts/:id", () => {
    it("Should return 204", async () => {
        const { tag, post } = await generatePost();
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/posts/${post.id}`)
            .set("authorization", `Bearer ${account.admin.token}`)
            .send({
            title: "random title",
        });
        expect(response.status).toBe(204);
        await database_1.database.post.delete({ where: { id: post.id } });
        await database_1.database.tag.delete({ where: { id: tag.id } });
    });
    it("Should return 400 with Chnage Something first", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/posts/x`)
            .set("authorization", `Bearer ${account.admin.token}`);
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(expect.arrayContaining([
            expect.objectContaining({
                path: ["root"],
                message: "Chnage Something first",
            }),
        ]));
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 400 with Invalid id", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/posts/x`)
            .set("authorization", `Bearer ${account.admin.token}`)
            .send({ title: "title" });
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid id");
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 404 with post does not exist", async () => {
        const { post, tag } = await generatePost();
        await database_1.database.post.delete({
            where: {
                id: post.id,
            },
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/posts/${post.id}`)
            .set("authorization", `Bearer ${account.admin.token}`)
            .send({ title: "title" });
        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toBe("Post does not exist");
        expect(response.body.error).toBe("Not Found");
        await database_1.database.tag.delete({
            where: {
                id: tag.id,
            },
        });
    });
    it("Should return 401", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .patch(`/api/posts/1`)
            .set("authorization", `Bearer ${account.user.token}`);
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });
});
describe("DELETE /posts/:id", () => {
    it("Should return 204", async () => {
        const { post, tag } = await generatePost();
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .delete(`/api/posts/${post.id}`)
            .set("authorization", `Bearer ${account.admin.token}`);
        expect(response.status).toBe(204);
        await database_1.database.tag.delete({
            where: {
                id: tag.id,
            },
        });
    });
    it("Should return 400 with Invalid id", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .delete(`/api/posts/xx`)
            .set("authorization", `Bearer ${account.admin.token}`);
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid id");
        expect(response.body.error).toBe("Bad Request");
    });
    it("Should return 404 with post does not exist", async () => {
        const { post, tag } = await generatePost();
        // cleanup
        await database_1.database.tag.delete({
            where: {
                id: tag.id,
            },
        });
        await database_1.database.post.delete({
            where: {
                id: post.id,
            },
        });
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .delete(`/api/posts/${post.id}`)
            .set("authorization", `Bearer ${account.admin.token}`);
        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toBe("Post does not exist");
        expect(response.body.error).toBe("Not Found");
    });
    it("Should return 401", async () => {
        const response = await (0, supertest_1.default)((0, app_1.default)())
            .delete(`/api/posts/1`)
            .set("authorization", `Bearer ${account.user.token}`);
        expect(response.status).toBe(401);
        expect(response.body.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });
});
