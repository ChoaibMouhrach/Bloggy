"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "showUserRequest", {
    enumerable: true,
    get: function() {
        return showUserRequest;
    }
});
const _database = require("../lib/database");
const showUserRequest = {
    authorize: (request)=>{
        const { user  } = request.auth;
        return user.roleId === _database.defaultRoles.ADMIN;
    }
};
