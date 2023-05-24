import { StoreTagRequest, UpdateTagRequest } from "@src/Requests";
import { database } from "@src/lib/database";
import { Request, Response } from "express";

const index = async (request: Request, response: Response) => {
  // search query
  const search = typeof request.query.search === "string" ? request.query.search : undefined;

  // page query
  const page = Number(request.query.page) ? Number(request.query.page) : 1;

  // trash query
  const trash = typeof request.query.trash === "string" ? (request.query.trash === "true") : undefined

  // pagination related
  const take = 8;
  const skip = take * (page - 1);

  // retrieve tags
  const tags = await database.tag.findMany({
    where: {
      name: {
        contains: search ?? "",
      },
      deletedAt: trash ? {
        not: null
      } : null
    },
    take,
    skip,
  });

  return response.json({
    data: tags,
    limit: take,
    skip,
    page,
    count: await database.tag.count(),
  });
};

const store = async (request: StoreTagRequest, response: Response) => {
  const { name } = request.body;

  // create tag
  const tag = await database.tag.create({
    data: { name },
  });

  return response.status(201).json(tag);
};

const update = async (request: UpdateTagRequest, response: Response) => {
  const { id, name } = request.body;

  await database.tag.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return response.sendStatus(204);
};

const destroy = async (request: Request, response: Response) => {
  const { id } = request.body;

  const tag = (await database.tag.findUnique({
    where: {
      id,
    },
  }))!;

  if (tag.deletedAt) {
    await database.tag.delete({
      where: {
        id: tag.id,
      },
    });
  } else {
    await database.tag.update({
      where: {
        id: tag.id,
      },
      data: { deletedAt: new Date() },
    });
  }

  return response.sendStatus(204);
};

export const tagController = {
  index,
  store,
  update,
  destroy,
};
