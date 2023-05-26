"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "destroyPostRequest", {
    enumerable: true,
    get: function() {
        return destroyPostRequest;
    }
});
const _database = require("../lib/database");
const authorize = (request)=>{
    const { user  } = request.auth;
    return user.roleId === _database.defaultRoles.ADMIN;
};
const destroyPostRequest = {
    authorize
};
