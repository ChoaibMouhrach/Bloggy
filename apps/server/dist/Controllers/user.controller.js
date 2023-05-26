"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "userController", {
    enumerable: true,
    get: function() {
        return userController;
    }
});
const _Exceptions = require("../Exceptions");
const _config = /*#__PURE__*/ _interop_require_default(require("../lib/config"));
const _database = require("../lib/database");
const _bcrypt = require("bcrypt");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const index = async (request, response)=>{
    // search query
    const search = typeof request.query.search === "string" ? request.query.search : undefined;
    // page query
    const page = Number(request.query.page) ? Number(request.query.page) : 1;
    // pagination related
    const take = 8;
    const skip = 8 * (page - 1);
    // retrieve users
    const users = await _database.database.user.findMany({
        where: {
            OR: [
                {
                    username: {
                        contains: search ?? ""
                    }
                },
                {
                    email: {
                        contains: search ?? ""
                    }
                }
            ]
        },
        include: {
            Role: true
        },
        take,
        skip
    });
    return response.json({
        data: users.map((user)=>(0, _database.prepareUser)(user)),
        limit: take,
        skip,
        page,
        count: await _database.database.user.count()
    });
};
const show = async (request, response)=>{
    // extract id
    const { id  } = request.params;
    // check id valid
    if (!Number(id)) {
        throw new _Exceptions.BadRequestException("Invalid id");
    }
    // retrieve user
    const user = await _database.database.user.findUnique({
        where: {
            id: Math.floor(Number(id))
        }
    });
    // check user existance
    if (!user) {
        throw new _Exceptions.NotFoundException("User");
    }
    return response.json((0, _database.prepareUser)(user));
};
const store = async (request, response)=>{
    // extract user
    const { username , email , password , bio , url , roleId  } = request.body;
    // save user
    const user = await _database.database.user.create({
        data: {
            username,
            email,
            password: (0, _bcrypt.hashSync)(password, Number(_config.default.SALT)),
            bio,
            url,
            roleId
        }
    });
    // send user
    return response.status(201).json((0, _database.prepareUser)(user));
};
const update = async (request, response)=>{
    const { id  } = request.params;
    // check if id is a number
    if (!Number(id)) {
        throw new _Exceptions.BadRequestException("Invalid id");
    }
    // if request got body then hashSync it
    if (request.body.password) {
        request.body.password = (0, _bcrypt.hashSync)(request.body.password, Number(_config.default.SALT));
    }
    const user = await _database.database.user.findUnique({
        where: {
            id: Math.floor(Number(id))
        }
    });
    if (!user) {
        throw new _Exceptions.NotFoundException("User");
    }
    // update user info
    await _database.database.user.update({
        where: {
            id: user.id
        },
        data: request.body
    });
    // send status
    return response.sendStatus(204);
};
const destroy = async (request, response)=>{
    // retrieve id
    const { id  } = request.params;
    // check if id is a number
    if (!Number(id)) {
        throw new _Exceptions.BadRequestException("Invalid id");
    }
    // get user
    const user = await _database.database.user.findUnique({
        where: {
            id: Number(id)
        }
    });
    // check existance
    if (!user) {
        throw new _Exceptions.NotFoundException("User");
    }
    // if user is soft deleted just delete it otherways soft delete it
    if (user.deletedAt) {
        await _database.database.user.delete({
            where: {
                id: user.id
            }
        });
    } else {
        await _database.database.user.update({
            where: {
                id: user.id
            },
            data: {
                deletedAt: new Date()
            }
        });
    }
    // 204 success
    return response.sendStatus(204);
};
const userController = {
    index,
    show,
    store,
    update,
    destroy
};
