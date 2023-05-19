import { BadRequestException, NotFoundException } from "@src/Exceptions";
import { StoreUserRequest, UpdateUserRequest } from "@src/Requests";
import config from "@src/lib/config";
import { database, prepareUser } from "@src/lib/database";
import { hashSync } from "bcrypt";
import { Request, Response } from "express";

const index = async (request: Request, response: Response) => {
  // search query
  const search =
    typeof request.query.search === "string" ? request.query.search : undefined;
  // page query
  const page = Number(request.query.page) ? Number(request.query.page) : 1;

  // pagination related
  const take = 8;
  const skip = 8 * (page - 1);

  // retrieve users
  let users = await database.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: search ?? "",
          },
        },
        {
          email: {
            contains: search ?? "",
          },
        },
      ],
    },
    include: {
      Role: true,
    },
    take,
    skip,
  });

  return response.json({
    data: users.map((user) => prepareUser(user)),
    limit: take,
    skip,
    count: await database.user.count(),
  });
};

const show = async (request: Request, response: Response) => {

  // extract id
  const { id } = request.params;

  // check id valid
  if (!Boolean(Number(id))) {
    throw new BadRequestException("Invalid id")
  }

  // retrieve user
  const user = await database.user.findUnique({
    where: {
      id: Number(id)
    }
  })

  // check user existance
  if (!user) {
    throw new NotFoundException("User")
  }

  return response.json(prepareUser(user))

};

const store = async (request: StoreUserRequest, response: Response) => {

  // extract user
  const {
    username,
    email,
    password,
    bio,
    url,
    roleId
  } = request.body;

  // save user
  const user = await database.user.create({
    data: {
      username,
      email,
      password: hashSync(password, Number(config.SALT)),
      bio,
      url,
      roleId
    }
  })

  // send user
  return response.status(201).json(prepareUser(user))

};

const update = async (request: UpdateUserRequest, response: Response) => {

  const { id } = request.params

  // check if id is a number
  if (!Boolean(Number(id))) {
    throw new BadRequestException("Invalid id")
  }

  // if request got body then hashSync it
  if (request.body.password) {
    request.body.password = hashSync(request.body.password, Number(config.SALT));
  }

  const user = await database.user.findUnique({
    where: {
      id: Number(id)
    }
  })

  if (!user) {
    throw new NotFoundException("User")
  }

  // update user info
  await database.user.update({
    where: { id: user.id },
    data: request.body
  })

  // send status
  return response.sendStatus(204)
};

const destroy = async (request: Request, response: Response) => {

  // retrieve id
  const { id } = request.params

  // check if id is a number
  if (!Boolean(Number(id))) {
    throw new BadRequestException("Invalid id")
  }

  // get user
  const user = await database.user.findUnique({
    where: {
      id: Number(id)
    }
  })

  // check existance
  if (!user) {
    throw new NotFoundException("User")
  }

  // if user is soft deleted just delete it otherways soft delete it
  if (user.deletedAt) {
    await database.user.delete({
      where: {
        id: user.id
      }
    })
  } else {
    await database.user.update({
      where: {
        id: user.id
      },
      data: {
        deletedAt: new Date()
      }
    })
  }

  // 204 success
  return response.sendStatus(204)
};

export const userController = {
  index,
  show,
  store,
  update,
  destroy,
};
