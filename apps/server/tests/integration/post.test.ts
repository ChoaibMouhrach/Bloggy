import makeApp from "@src/app";
import jwt from "jsonwebtoken";
import request from "supertest";
import { database } from "@src/lib/database";
import config from "@src/lib/config";
import { User } from "@prisma/client";
import {
  adminPayload,
  postPayload,
  tagPaylaod,
  userPayload,
} from "../config/test-data";

type Account = {
  user: {
    token?: string;
    user?: User;
  };
  admin: {
    user?: User;
    token?: string;
  };
};

let account: Account = {
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
  const adminPayloadClone = adminPayload();
  const userPayloadClone = userPayload();

  const adminObject = await database.user.create({
    data: adminPayloadClone,
  });

  const userObject = await database.user.create({
    data: userPayloadClone,
  });

  account = {
    admin: {
      user: adminObject,
      token: jwt.sign({ id: adminObject.id }, config.SECRET_ACCESS),
    },
    user: {
      user: userObject,
      token: jwt.sign({ id: userObject.id }, config.SECRET_ACCESS),
    },
  };
});

afterAll(async () => {
  await database.user.delete({
    where: {
      id: account.admin.user?.id,
    },
  });

  await database.user.delete({
    where: {
      id: account.user.user?.id,
    },
  });
});

describe("GET /posts", () => {
  it("Should return 200 with paginated posts", async () => {
    const response = await request(makeApp()).get("/api/posts");

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.limit).toBeDefined();
    expect(response.body.skip).toBeDefined();
  });
});

const generateTag = async () => {
  return await database.tag.create({ data: tagPaylaod() });
};

const generatePost = async () => {
  const tag = await generateTag();
  const post = await database.post.create({
    data: { ...postPayload(), tags: { connect: [{ id: tag.id }] } },
  });
  return {
    post,
    tag,
  };
};

describe("GET /posts/:id", () => {
  it("Should return 200 with post", async () => {
    const { post, tag } = await generatePost();

    const response = await request(makeApp()).get(`/api/posts/${post.id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(post.title);

    // cleanup
    await database.tag.delete({
      where: {
        id: tag.id,
      },
    });

    await database.post.delete({
      where: {
        id: post.id,
      },
    });
  });

  it("Should return 400 with Invalid id", async () => {
    const response = await request(makeApp()).get(`/api/posts/xx`);

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid id");
    expect(response.body.error).toBe("Bad Request");
  });

  it("Should return 404 with post does not exist", async () => {
    const { post, tag } = await generatePost();

    // cleanup
    await database.tag.delete({
      where: {
        id: tag.id,
      },
    });

    await database.post.delete({
      where: {
        id: post.id,
      },
    });

    const response = await request(makeApp()).get(`/api/posts/${post.id}`);

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toBe("Post does not exist");
    expect(response.body.error).toBe("Not Found");
  });
});

describe("POST /posts", () => {
  it("Should return 201 with post", async () => {
    const tag = await generateTag();
    const post = postPayload();

    const response = await request(makeApp())
      .post(`/api/posts`)
      .set("authorization", `Bearer ${account.admin?.token}`)
      .send({
        ...post,
        tags: [tag.id],
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(post.title);

    // cleanup
    await database.tag.delete({
      where: {
        id: tag.id,
      },
    });

    await database.post.delete({
      where: {
        id: response.body.id,
      },
    });
  });

  it("Should return 400 with title required", async () => {
    const response = await request(makeApp())
      .post(`/api/posts`)
      .set("authorization", `Bearer ${account.admin.token}`);

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["title"],
          message: "Required",
        }),
      ])
    );

    expect(response.body.error).toBe("Bad Request");
  });

  it("Should return 400 with tag does not exist", async () => {
    const tag = await generateTag();
    await database.tag.delete({ where: { id: tag.id } });

    const response = await request(makeApp())
      .post(`/api/posts`)
      .set("authorization", `Bearer ${account.admin.token}`)
      .send({
        ...postPayload(),
        tags: [tag.id],
      });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: expect.arrayContaining(["tags"]),
          message: "Tag does not exists",
        }),
      ])
    );

    expect(response.body.error).toBe("Bad Request");
  });

  it("Should return 400 with at least one tag is required", async () => {
    const tag = await generateTag();
    await database.tag.delete({ where: { id: tag.id } });

    const response = await request(makeApp())
      .post(`/api/posts`)
      .set("authorization", `Bearer ${account.admin.token}`)
      .send({
        ...postPayload(),
        tags: [],
      });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: expect.arrayContaining(["tags"]),
          message: "At least one tag is required",
        }),
      ])
    );

    expect(response.body.error).toBe("Bad Request");
  });

  it("Should return 401", async () => {
    const response = await request(makeApp())
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

    const response = await request(makeApp())
      .patch(`/api/posts/${post.id}`)
      .set("authorization", `Bearer ${account.admin.token}`)
      .send({
        title: "random title",
      });

    expect(response.status).toBe(204);

    await database.post.delete({ where: { id: post.id } });
    await database.tag.delete({ where: { id: tag.id } });
  });

  it("Should return 400 with Chnage Something first", async () => {
    const response = await request(makeApp())
      .patch(`/api/posts/x`)
      .set("authorization", `Bearer ${account.admin.token}`);

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["root"],
          message: "Chnage Something first",
        }),
      ])
    );

    expect(response.body.error).toBe("Bad Request");
  });

  it("Should return 400 with Invalid id", async () => {
    const response = await request(makeApp())
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

    await database.post.delete({
      where: {
        id: post.id,
      },
    });

    const response = await request(makeApp())
      .patch(`/api/posts/${post.id}`)
      .set("authorization", `Bearer ${account.admin.token}`)
      .send({ title: "title" });

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toBe("Post does not exist");
    expect(response.body.error).toBe("Not Found");

    await database.tag.delete({
      where: {
        id: tag.id,
      },
    });
  });

  it("Should return 401", async () => {
    const response = await request(makeApp())
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

    const response = await request(makeApp())
      .delete(`/api/posts/${post.id}`)
      .set("authorization", `Bearer ${account.admin.token}`);

    expect(response.status).toBe(204);

    await database.tag.delete({
      where: {
        id: tag.id,
      },
    });
  });

  it("Should return 400 with Invalid id", async () => {
    const response = await request(makeApp())
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
    await database.tag.delete({
      where: {
        id: tag.id,
      },
    });

    await database.post.delete({
      where: {
        id: post.id,
      },
    });

    const response = await request(makeApp())
      .delete(`/api/posts/${post.id}`)
      .set("authorization", `Bearer ${account.admin.token}`);

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toBe("Post does not exist");
    expect(response.body.error).toBe("Not Found");
  });

  it("Should return 401", async () => {
    const response = await request(makeApp())
      .delete(`/api/posts/1`)
      .set("authorization", `Bearer ${account.user.token}`);

    expect(response.status).toBe(401);
    expect(response.body.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthorized");
  });
});
