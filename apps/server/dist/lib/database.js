"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    database: function() {
        return database;
    },
    defaultRoles: function() {
        return defaultRoles;
    },
    prepareUser: function() {
        return prepareUser;
    }
});
const _client = require("@prisma/client");
const database = new _client.PrismaClient();
const defaultRoles = {
    ADMIN: 1,
    MEMBER: 2
};
const prepareUser = (user)=>{
    const newUser = user;
    delete newUser.password;
    return newUser;
};
