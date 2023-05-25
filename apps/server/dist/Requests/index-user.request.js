"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "indexUserRequest", {
    enumerable: true,
    get: function() {
        return indexUserRequest;
    }
});
const _database = require("../lib/database");
const authorize = (request)=>{
    const { user  } = request.auth;
    return user.roleId === _database.defaultRoles.ADMIN;
};
const indexUserRequest = {
    authorize
};
