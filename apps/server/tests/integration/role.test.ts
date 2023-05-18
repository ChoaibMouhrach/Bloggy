import makeApp from "@src/app";
import { database, defaultRoles } from "@src/lib/database";
import request from "supertest";
import { adminPayload, rolePayload } from "../config/test-data";
import config from "@src/lib/config";
import jwt from "jsonwebtoken";

beforeEach((done) => {
  database.role
    .deleteMany({
      where: {
        NOT: [{ id: defaultRoles.ADMIN }, { id: defaultRoles.MEMBER }],
      },
    })
    .then(() => done());
});

afterEach(async () => {
  await database.role.deleteMany({
    where: {
      NOT: [{ id: defaultRoles.ADMIN }, { id: defaultRoles.MEMBER }],
    },
  });
});

describe("GET /roles", () => {
  it("Should return 200 with paginated data", async () => {
    const response = await request(makeApp()).get("/api/roles");

    expect(response.status).toBe(200);
    expect(response.body.skip).toBeDefined();
    expect(response.body.limit).toBeDefined();
    expect(response.body.count).toBeDefined();
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "admin",
        }),
        expect.objectContaining({
          name: "member",
        }),
      ])
    );
  });

  it("Should return 200 with admin only", async () => {
    const response = await request(makeApp()).get("/api/roles?search=admin");

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
    let adminPayloadClone = adminPayload();
    let payload = rolePayload();

    const admin = await database.user.create({ data: adminPayloadClone });
    const token = jwt.sign({ id: admin.id }, config.SECRET_ACCESS);

    const response = await request(makeApp())
      .post("/api/roles")
      .set("authorization", `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(payload.name);

    await database.role.delete({
      where: { id: response.body.id },
    });

    await database.user.delete({
      where: { id: admin.id },
    });
  });

  it("Should return 400 with role already exists", async () => {
    let adminPayloadClone = adminPayload();

    const admin = await database.user.create({ data: adminPayloadClone });

    const token = jwt.sign({ id: admin.id }, config.SECRET_ACCESS);

    const response = await request(makeApp())
      .post("/api/roles")
      .set("authorization", `Bearer ${token}`)
      .send({ name: "admin" });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["name"],
          message: "Role already exists",
        }),
      ])
    );

    await database.user.delete({ where: { id: admin.id } });
  });
});

describe("PATCH /roles/:id", () => {
  it("Should return 204", async () => {
    let adminPayloadClone = adminPayload();
    let payload = rolePayload();

    const admin = await database.user.create({ data: adminPayloadClone });
    const role = await database.role.create({ data: payload });

    const token = jwt.sign({ id: admin.id }, config.SECRET_ACCESS);

    const response = await request(makeApp())
      .patch(`/api/roles/${role.id}`)
      .set("authorization", `Bearer ${token}`)
      .send({ name: "admin" + Math.random() });

    expect(response.status).toBe(204);

    await database.user.delete({ where: { id: admin.id } });
    await database.role.delete({ where: { id: role.id } });
  });

  it("Should return 400 with role already exists", async () => {
    let adminPayloadClone = adminPayload();
    let payload = rolePayload();

    const admin = await database.user.create({ data: adminPayloadClone });
    const role = await database.role.create({ data: payload });

    const token = jwt.sign({ id: admin.id }, config.SECRET_ACCESS);

    const response = await request(makeApp())
      .patch(`/api/roles/${role.id}`)
      .set("authorization", `Bearer ${token}`)
      .send({ name: "admin" });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["name"],
          message: "Role already exists",
        }),
      ])
    );
    expect(response.body.error).toBe("Bad Request");

    await database.user.delete({ where: { id: admin.id } });
    await database.role.delete({ where: { id: role.id } });
  });

  it("Should return 400 with id is invalid", async () => {
    let adminPayloadClone = adminPayload();

    const admin = await database.user.create({ data: adminPayloadClone });

    const token = jwt.sign({ id: admin.id }, config.SECRET_ACCESS);

    const response = await request(makeApp())
      .patch(`/api/roles/zefz`)
      .set("authorization", `Bearer ${token}`)
      .send({ name: "admin" + Math.random() });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid id");
    expect(response.body.error).toBe("Bad Request");

    await database.user.delete({ where: { id: admin.id } });
  });
});

describe("DELETE /roles/:id", () => {
  it("Should return 204", async () => {
    let adminPayloadClone = adminPayload();
    let payload = rolePayload();

    const admin = await database.user.create({ data: adminPayloadClone });
    const role = await database.role.create({ data: payload });

    const token = jwt.sign({ id: admin.id }, config.SECRET_ACCESS);

    const response = await request(makeApp())
      .delete(`/api/roles/${role.id}`)
      .set("authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    await database.user.delete({ where: { id: admin.id } });
  });

  it("Should return 401 with unatuthorized", async () => {
    let adminPayloadClone = adminPayload();

    const admin = await database.user.create({ data: adminPayloadClone });

    const token = jwt.sign({ id: admin.id }, config.SECRET_ACCESS);

    const response = await request(makeApp())
      .delete(`/api/roles/1`)
      .set("authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);

    await database.user.delete({ where: { id: admin.id } });
  });

  it("Should return 400 with id is invalid", async () => {
    let adminPayloadClone = adminPayload();

    const admin = await database.user.create({ data: adminPayloadClone });

    const token = jwt.sign({ id: admin.id }, config.SECRET_ACCESS);

    const response = await request(makeApp())
      .delete(`/api/roles/zefklj`)
      .set("authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid id");
    expect(response.body.error).toBe("Bad Request");

    await database.user.delete({ where: { id: admin.id } });
  });
});
