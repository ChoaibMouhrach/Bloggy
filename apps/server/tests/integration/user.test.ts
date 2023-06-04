import makeApp from "@src/app";
import { database } from "@src/lib/database";
import request from "supertest";
import jwt from "jsonwebtoken";
import config from "@src/lib/config";
import { User } from "@prisma/client";
import { adminPayload, userPayload } from "../config/test-data";

const admin: { token?: string; id?: number; admin?: User } = {
  id: undefined,
  token: undefined,
  admin: undefined,
};

const user: { token?: string; id?: number; user?: User } = {
  id: undefined,
  token: undefined,
  user: undefined,
};

beforeAll(async () => {
  const adminPayloadClone = adminPayload();

  const adminObject = await database.user.create({
    data: adminPayloadClone,
  });

  const userPayloadClone = userPayload();

  const userObject = await database.user.create({
    data: userPayloadClone,
  });

  admin.token = jwt.sign({ id: adminObject.id }, config.SECRET_ACCESS);
  admin.admin = adminObject;
  admin.id = adminObject.id;

  user.token = jwt.sign({ id: userObject.id }, config.SECRET_ACCESS);
  user.user = userObject;
  user.id = userObject.id;
});

afterAll(async () => {
  await database.user.delete({
    where: {
      id: admin.id,
    },
  });

  await database.user.delete({
    where: {
      id: user.id,
    },
  });
});

describe("GET /users", () => {
  it("Should return 200 with paginated users", async () => {
    const response = await request(makeApp())
      .get("/api/users")
      .set("authorization", `Bearer ${admin.token}`);

    expect(response.status).toBe(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.limit).toBeDefined();
    expect(response.body.skip).toBeDefined();
    expect(response.body.page).toBeDefined();
  });

  it("Should return 401 with unauthorized", async () => {
    const response = await request(makeApp())
      .get("/api/users")
      .set("authorization", `Bearer ${user.token}`);

    expect(response.status).toBe(401);

    expect(response.body.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthorized");
  });
});

describe("GET /users/:id", () => {
  it("Should return 200 with user", async () => {
    const response = await request(makeApp())
      .get(`/api/users/${admin.id}`)
      .set("authorization", `Bearer ${admin.token}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBeDefined();
  });

  it("Should return 400 with invalid id", async () => {
    const response = await request(makeApp())
      .get(`/api/users/x`)
      .set("authorization", `Bearer ${admin.token}`);

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBeDefined();
    expect(response.body.message).toBe("Invalid id");
    expect(response.body.error).toBe("Bad Request");
  });

  it("Should return 404 with does not exist", async () => {
    const response = await request(makeApp())
      .get(`/api/users/${Math.random()}`)
      .set("authorization", `Bearer ${admin.token}`);

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBeDefined();
    expect(response.body.message).toBe("User does not exist");
    expect(response.body.error).toBe("Not Found");
  });

  it("Should return 401 with unauthorized", async () => {
    const response = await request(makeApp())
      .get("/api/users/1")
      .set("authorization", `Bearer ${user.token}`);

    expect(response.status).toBe(401);

    expect(response.body.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthorized");
  });
});

describe("POST /users", () => {
  it("Should return 201 with user", async () => {
    const payload = userPayload();

    const response = await request(makeApp())
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
    const response = await request(makeApp())
      .post("/api/users")
      .set("authorization", `bearer ${admin.token}`)
      .send({
        ...user.user,
        password: "password",
        password_confirmation: "password",
      });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["username"],
          message: "Username is already taken",
        }),
        expect.objectContaining({
          path: ["email"],
          message: "Email address is already taken",
        }),
      ])
    );
    expect(response.body.error).toBe("Bad Request");
  });

  it("Should return 400 with password and password confirmation does not match", async () => {
    const payload = userPayload();

    const response = await request(makeApp())
      .post("/api/users")
      .set("authorization", `bearer ${admin.token}`)
      .send({
        ...payload,
        password: "password",
        password_confirmation: "password1",
      });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["password_confirmation"],
          message: "Password and Password confirmation does not exists",
        }),
      ])
    );
    expect(response.body.error).toBe("Bad Request");
  });

  it("Should return 401 with unauthorized", async () => {
    const response = await request(makeApp())
      .post("/api/users")
      .set("authorization", `Bearer ${user.token}`);

    expect(response.status).toBe(401);

    expect(response.body.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthorized");
  });
});

describe("PATCH /users/:id", () => {
  it("Should return 204", async () => {
    const payload = userPayload();

    const response = await request(makeApp())
      .patch(`/api/users/${user.id}`)
      .set("authorization", `bearer ${admin.token}`)
      .send({
        username: payload.username,
      });

    expect(response.status).toBe(204);
  });

  it("Should return 400 with username and email is already taken", async () => {
    const response = await request(makeApp())
      .patch(`/api/users/${user.id}`)
      .set("authorization", `bearer ${admin.token}`)
      .send({
        username: admin.admin?.username,
        email: user.user?.email,
      });

    expect(response.status).toBe(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["username"],
          message: "Username is already taken",
        }),
        expect.objectContaining({
          path: ["email"],
          message: "Email address is already taken",
        }),
      ])
    );
    expect(response.body.error).toBe("Bad Request");
  });

  it("Should return 400 Password and Password confirmation does not match", async () => {
    const response = await request(makeApp())
      .patch(`/api/users/${user.id}`)
      .set("authorization", `bearer ${admin.token}`)
      .send({
        password: "password",
      });

    expect(response.status).toBe(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["password_confirmation"],
          message: "Password and Password confirmation does not match",
        }),
      ])
    );
    expect(response.body.error).toBe("Bad Request");
  });

  it("Should return 401 with unauthorized", async () => {
    const response = await request(makeApp())
      .patch("/api/users/1")
      .set("authorization", `Bearer ${user.token}`);

    expect(response.status).toBe(401);

    expect(response.body.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthorized");
  });
});

describe("DELETE /users/:id", () => {
  it("Should return 204", async () => {
    const userPayloadClone = userPayload();

    const newUser = await database.user.create({
      data: userPayloadClone,
    });

    const response = await request(makeApp())
      .patch(`/api/users/${newUser.id}`)
      .set("authorization", `bearer ${admin.token}`);

    expect(response.status).toBe(204);
  });

  it("Should return 401 with unauthorized", async () => {
    const response = await request(makeApp())
      .delete("/api/users/1")
      .set("authorization", `Bearer ${user.token}`);

    expect(response.status).toBe(401);

    expect(response.body.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthorized");
  });
});
