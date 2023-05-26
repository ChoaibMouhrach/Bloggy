"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "roleController", {
    enumerable: true,
    get: function() {
        return roleController;
    }
});
const _Exceptions = require("../Exceptions");
const _database = require("../lib/database");
const index = async (request, response)=>{
    const search = typeof request.query.search === "string" ? request.query.search : undefined;
    const page = Number(request.query.page) ? Number(request.query.page) : 1;
    const take = 8;
    const skip = 8 * (page - 1);
    const roles = await _database.database.role.findMany({
        where: {
            name: {
                contains: search
            }
        },
        skip,
        take
    });
    return response.json({
        data: roles,
        count: await _database.database.role.count(),
        limit: take,
        page,
        skip
    });
};
const store = async (request, response)=>{
    // role name
    const { name  } = request.body;
    // role
    const role = await _database.database.role.create({
        data: {
            name
        }
    });
    // return role
    return response.status(201).json(role);
};
const update = async (request, response)=>{
    // params
    const { id  } = request.params;
    // body
    const { name  } = request.body;
    if (!Number(id)) {
        throw new _Exceptions.BadRequestException("Invalid id");
    }
    await _database.database.role.update({
        where: {
            id: Number(id)
        },
        data: {
            name
        }
    });
    return response.sendStatus(204);
};
const destroy = async (request, response)=>{
    const { id  } = request.params;
    if (!Number(id)) {
        throw new _Exceptions.BadRequestException("Invalid id");
    }
    if (!await _database.database.role.findUnique({
        where: {
            id: Number(id)
        }
    })) {
        throw new _Exceptions.NotFoundException("Role");
    }
    await _database.database.role.delete({
        where: {
            id: Number(id)
        }
    });
    return response.sendStatus(204);
};
const roleController = {
    index,
    store,
    update,
    destroy
};
