"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "tagController", {
    enumerable: true,
    get: function() {
        return tagController;
    }
});
const _database = require("../lib/database");
const index = async (request, response)=>{
    // search query
    const search = typeof request.query.search === "string" ? request.query.search : undefined;
    // page query
    const page = Number(request.query.page) ? Number(request.query.page) : 1;
    // trash query
    const trash = typeof request.query.trash === "string" ? request.query.trash === "true" : undefined;
    // pagination related
    const take = 8;
    const skip = take * (page - 1);
    // retrieve tags
    const tags = await _database.database.tag.findMany({
        where: {
            name: {
                contains: search ?? ""
            },
            deletedAt: trash ? {
                not: null
            } : null
        },
        take,
        skip
    });
    return response.json({
        data: tags,
        limit: take,
        skip,
        page,
        count: await _database.database.tag.count()
    });
};
const store = async (request, response)=>{
    const { name  } = request.body;
    // create tag
    const tag = await _database.database.tag.create({
        data: {
            name
        }
    });
    return response.status(201).json(tag);
};
const update = async (request, response)=>{
    const { id , name  } = request.body;
    await _database.database.tag.update({
        where: {
            id
        },
        data: {
            name
        }
    });
    return response.sendStatus(204);
};
const destroy = async (request, response)=>{
    const { id  } = request.body;
    const tag = await _database.database.tag.findUnique({
        where: {
            id
        }
    });
    if (tag.deletedAt) {
        await _database.database.tag.delete({
            where: {
                id: tag.id
            }
        });
    } else {
        await _database.database.tag.update({
            where: {
                id: tag.id
            },
            data: {
                deletedAt: new Date()
            }
        });
    }
    return response.sendStatus(204);
};
const tagController = {
    index,
    store,
    update,
    destroy
};
