"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "postController", {
    enumerable: true,
    get: function() {
        return postController;
    }
});
const _Exceptions = require("../Exceptions");
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
    const skip = 8 * (page - 1);
    // retrieve posts
    const posts = await _database.database.post.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: search ?? ""
                    }
                },
                {
                    content: {
                        contains: search ?? ""
                    }
                },
                {
                    tags: {
                        some: {
                            name: {
                                contains: search ?? ""
                            }
                        }
                    }
                }
            ],
            deletedAt: trash ? {
                not: null
            } : null
        },
        include: {
            tags: true
        },
        take,
        skip
    });
    return response.json({
        data: posts,
        limit: take,
        skip,
        page,
        count: await _database.database.post.count()
    });
};
const show = async (request, response)=>{
    const { id  } = request.params;
    if (!Number.isInteger(Number(id))) {
        throw new _Exceptions.BadRequestException("Invalid id");
    }
    const post = await _database.database.post.findUnique({
        where: {
            id: Number(id)
        }
    });
    if (!post) {
        throw new _Exceptions.NotFoundException("Post");
    }
    return response.json(post);
};
const store = async (request, response)=>{
    const { title , content , isDraft , tags  } = request.body;
    const post = await _database.database.post.create({
        data: {
            title,
            content,
            isDraft,
            tags: {
                connect: [
                    ...new Set(tags)
                ].map((id)=>({
                        id
                    }))
            }
        },
        include: {
            tags: true
        }
    });
    return response.status(201).json(post);
};
const update = async (request, response)=>{
    const { id  } = request.params;
    if (!Number.isInteger(Number(id))) {
        throw new _Exceptions.BadRequestException("Invalid id");
    }
    const post = await _database.database.post.findUnique({
        where: {
            id: Number(id)
        }
    });
    if (!post) throw new _Exceptions.NotFoundException("Post");
    const { title , content , isDraft , tags , addTags , removeTags  } = request.body;
    await _database.database.post.update({
        where: {
            id: post.id
        },
        data: {
            title,
            content,
            isDraft,
            tags: {
                set: tags ? [
                    ...new Set(tags)
                ].map((tag)=>({
                        id: tag
                    })) : undefined,
                connect: addTags ? [
                    ...new Set(addTags)
                ].map((tag)=>({
                        id: tag
                    })) : undefined,
                disconnect: removeTags ? [
                    ...new Set(removeTags)
                ].map((tag)=>({
                        id: tag
                    })) : undefined
            }
        }
    });
    return response.sendStatus(204);
};
const destroy = async (request, response)=>{
    const { id  } = request.params;
    if (!Number.isInteger(Number(id))) {
        throw new _Exceptions.BadRequestException("Invalid id");
    }
    const post = await _database.database.post.findUnique({
        where: {
            id: Number(id)
        }
    });
    if (!post) throw new _Exceptions.NotFoundException("Post");
    if (post.deletedAt) {
        await _database.database.post.delete({
            where: {
                id: post.id
            }
        });
    } else {
        await _database.database.post.update({
            where: {
                id: post.id
            },
            data: {
                deletedAt: new Date()
            }
        });
    }
    return response.sendStatus(204);
};
const postController = {
    index,
    show,
    store,
    update,
    destroy
};
