import { User } from "@prisma/client";
import makeApp from "@src/app";
import { database } from "@src/lib/database";
import request from "supertest";
import jwt from "jsonwebtoken";
import config from "@src/lib/config";
import { adminPayload, tagPaylaod, userPayload } from "../config/test-data";

const admin: { admin?: User; token?: string } = {
  admin: undefined,
  token: undefined,
};

const user: { user?: User; token?: string } = {
  user: undefined,
  token: undefined,
};

beforeAll(async () => {
  const adminPayloadClone = adminPayload();
  const userPayloadClone = userPayload();

  const adminObject = await database.user.create({
    data: adminPayloadClone,
  });
  const userObject = await database.user.create({
    data: userPayloadClone,
  });

  admin.admin = adminObject;
  admin.token = jwt.sign({ id: adminObject.id }, config.SECRET_ACCESS);

  user.user = userObject;
  user.token = jwt.sign({ id: userObject.id }, config.SECRET_ACCESS);
});

afterAll(async () => {
  await database.user.delete({
    where: { id: admin.admin?.id },
  });
  await database.user.delete({
    where: { id: user.user?.id },
  });
});

describe("GET /tags", () => {
  it("Should return 200 with paginated tags", async () => {
    const response = await request(makeApp())
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
    const payload = tagPaylaod();

    const response = await request(makeApp())
      .post("/api/tags")
      .set("authorization", `Bearer ${admin.token}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(payload.name);

    await database.tag.delete({
      where: {
        id: response.body.id,
      },
    });
  });

  it("Should return 400 with tag already exists", async () => {
    const payload = tagPaylaod();

    const tag = await database.tag.create({
      data: payload,
    });

    const response = await request(makeApp())
      .post("/api/tags")
      .set("authorization", `Bearer ${admin.token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["name"],
          message: "Tag is already taken",
        }),
      ])
    );

    await database.tag.delete({
      where: {
        id: tag.id,
      },
    });
  });

  it("Should return 401 with Unauthorized", async () => {
    const response = await request(makeApp())
      .post("/api/tags")
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(401);
  });
});

describe("PATCH /tags/:id", () => {
  it("Should return 204", async () => {
    const payload = tagPaylaod();
    const tag = await database.tag.create({ data: payload });

    const response = await request(makeApp())
      .patch(`/api/tags/${tag.id}`)
      .set("authorization", `Bearer ${admin.token}`)
      .send(tagPaylaod());

    expect(response.status).toBe(204);
    await database.tag.delete({
      where: {
        id: tag.id,
      },
    });
  });

  it("Should return 400 with tag already exists", async () => {
    const payload = tagPaylaod();
    const tag = await database.tag.create({ data: payload });

    const response = await request(makeApp())
      .patch(`/api/tags/${tag.id}`)
      .set("authorization", `Bearer ${admin.token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.error).toBe("Bad Request");
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["name"],
          message: "Tag is already taken",
        }),
      ])
    );
    await database.tag.delete({
      where: {
        id: tag.id,
      },
    });
  });

  it("Should return 400 with tag already taken", async () => {
    const payload = tagPaylaod();
    const tag = await database.tag.create({ data: payload });

    const response = await request(makeApp())
      .patch(`/api/tags/${tag.id}`)
      .set("authorization", `Bearer ${admin.token}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.error).toBe("Bad Request");
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["name"],
          message: "Tag is already taken",
        }),
      ])
    );

    await database.tag.delete({
      where: {
        id: tag.id,
      },
    });
  });

  it("Should return 401 with Unauthorized", async () => {
    const response = await request(makeApp())
      .patch("/api/tags/1")
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(401);
  });
});

describe("DELETE /tags/:id", () => {
  it("Should return 204", async () => {
    const payload = tagPaylaod();
    const tag = await database.tag.create({ data: payload });

    const response = await request(makeApp())
      .delete(`/api/tags/${tag.id}`)
      .set("authorization", `Bearer ${admin.token}`);

    expect(response.status).toBe(204);
  });

  it("Should return 400 with tag does not exists", async () => {
    const payload = tagPaylaod();

    const tag = await database.tag.create({ data: payload });
    await database.tag.delete({
      where: {
        id: tag.id,
      },
    });

    const response = await request(makeApp())
      .delete(`/api/tags/${tag.id}`)
      .set("authorization", `Bearer ${admin.token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["id"],
          message: "Tag does not exist",
        }),
      ])
    );
  });

  it("Should return 401 with Unauthorized", async () => {
    const response = await request(makeApp())
      .delete("/api/tags/1")
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(401);
  });
});
