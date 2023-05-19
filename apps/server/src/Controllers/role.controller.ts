import { BadRequestException, NotFoundException } from "@src/Exceptions";
import { StoreRoleRequest } from "@src/Requests/store-role.request";
import { UpdateRoleRequest } from "@src/Requests/update-role.request";
import { database } from "@src/lib/database";
import { Request, Response } from "express";

const index = async (request: Request, response: Response) => {
  const search =
    typeof request.query.search === "string" ? request.query.search : undefined;
  const page = Number(request.query.page) ? Number(request.query.page) : 1;

  const take = 8;
  const skip = 8 * (page - 1);

  const roles = await database.role.findMany({
    where: {
      name: { contains: search },
    },
    skip,
    take,
  });

  return response.json({
    data: roles,
    count: await database.role.count(),
    limit: take,
    page,
    skip,
  });
};

const store = async (request: StoreRoleRequest, response: Response) => {
  // role name
  const { name } = request.body;

  // role
  const role = await database.role.create({
    data: {
      name,
    },
  });

  // return role
  return response.status(201).json(role);
};

const update = async (request: UpdateRoleRequest, response: Response) => {
  // params
  const { id } = request.params;

  // body
  const { name } = request.body;

  if (!Boolean(Number(id))) {
    throw new BadRequestException("Invalid id");
  }

  await database.role.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
    },
  });

  return response.sendStatus(204);
};

const destroy = async (request: Request, response: Response) => {
  const { id } = request.params;

  if (!Boolean(Number(id))) {
    throw new BadRequestException("Invalid id");
  }

  if (!(await database.role.findUnique({ where: { id: Number(id) } }))) {
    throw new NotFoundException("Role");
  }

  await database.role.delete({
    where: {
      id: Number(id),
    },
  });

  return response.sendStatus(204);
};

export const roleController = {
  index,
  store,
  update,
  destroy,
};
