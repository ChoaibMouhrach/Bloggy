import { BadRequestException, NotFoundException } from "@src/Exceptions";
import { StorePostRequest, UpdatePostRequest } from "@src/Requests";
import { database } from "@src/lib/database";
import { Request, Response } from "express";

const index = async (request: Request, response: Response) => {
  // search query
  const search =
    typeof request.query.search === "string" ? request.query.search : undefined;

  // page query
  const page = Number(request.query.page) ? Number(request.query.page) : 1;

  // trash query
  const trash =
    typeof request.query.trash === "string"
      ? request.query.trash === "true"
      : undefined;

  // pagination related
  const take = 8;
  const skip = 8 * (page - 1);

  // retrieve posts
  const posts = await database.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search ?? "",
          },
        },
        {
          content: {
            contains: search ?? "",
          },
        },
        {
          tags: {
            some: {
              name: {
                contains: search ?? "",
              },
            },
          },
        },
      ],
      deletedAt: trash
        ? {
            not: null,
          }
        : null,
    },
    include: {
      tags: true,
    },
    take,
    skip,
  });

  return response.json({
    data: posts,
    limit: take,
    skip,
    page,
    count: await database.post.count(),
  });
};

const show = async (request: Request, response: Response) => {
  const { id } = request.params;

  if (!Number.isInteger(Number(id))) {
    throw new BadRequestException("Invalid id");
  }

  const post = await database.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!post) {
    throw new NotFoundException("Post");
  }

  return response.json(post);
};

const store = async (request: StorePostRequest, response: Response) => {
  const { title, content, isDraft, tags } = request.body;

  const post = await database.post.create({
    data: {
      title,
      content,
      isDraft,
      tags: {
        connect: [...new Set(tags)].map((id) => ({ id })),
      },
    },
    include: {
      tags: true,
    },
  });

  return response.status(201).json(post);
};

const update = async (request: UpdatePostRequest, response: Response) => {
  const { id } = request.params;

  if (!Number.isInteger(Number(id))) {
    throw new BadRequestException("Invalid id");
  }

  const post = await database.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!post) throw new NotFoundException("Post");

  const { title, content, isDraft, tags, addTags, removeTags } = request.body;

  await database.post.update({
    where: {
      id: post.id,
    },
    data: {
      title,
      content,
      isDraft,
      tags: {
        set: tags ? [...new Set(tags)].map((tag) => ({ id: tag })) : undefined,
        connect: addTags
          ? [...new Set(addTags)].map((tag) => ({ id: tag }))
          : undefined,
        disconnect: removeTags
          ? [...new Set(removeTags)].map((tag) => ({ id: tag }))
          : undefined,
      },
    },
  });

  return response.sendStatus(204);
};

const destroy = async (request: Request, response: Response) => {
  const { id } = request.params;

  if (!Number.isInteger(Number(id))) {
    throw new BadRequestException("Invalid id");
  }

  const post = await database.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!post) throw new NotFoundException("Post");

  if (post.deletedAt) {
    await database.post.delete({
      where: { id: post.id },
    });
  } else {
    await database.post.update({
      where: {
        id: post.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  return response.sendStatus(204);
};

export const postController = {
  index,
  show,
  store,
  update,
  destroy,
};
