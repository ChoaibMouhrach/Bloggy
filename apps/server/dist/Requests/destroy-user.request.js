"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "destroyUserRequest", {
    enumerable: true,
    get: function() {
        return destroyUserRequest;
    }
});
const _database = require("../lib/database");
const destroyUserRequest = {
    authorize: (request)=>{
        const { user  } = request.auth;
        return user.roleId === _database.defaultRoles.ADMIN;
    }
};
