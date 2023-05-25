"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "destroyRoleRequest", {
    enumerable: true,
    get: function() {
        return destroyRoleRequest;
    }
});
const _database = require("../lib/database");
const authorize = (request)=>{
    const { user  } = request.auth;
    const { id  } = request.params;
    // admin role id
    return user.roleId === _database.defaultRoles.ADMIN && !Object.values(_database.defaultRoles).includes(Number(id));
};
const destroyRoleRequest = {
    authorize
};
