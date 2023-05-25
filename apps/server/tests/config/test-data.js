"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPayload = exports.adminPayload = exports.tagPaylaod = exports.rolePayload = exports.postPayload = void 0;
const database_1 = require("@src/lib/database");
const postPayload = () => ({
    title: "post",
    content: "content",
    isDraft: false,
});
exports.postPayload = postPayload;
const rolePayload = () => ({
    name: `supplier${Math.random()}`,
});
exports.rolePayload = rolePayload;
const tagPaylaod = () => ({
    name: `tag${Math.random()}`,
});
exports.tagPaylaod = tagPaylaod;
const adminPayload = () => ({
    username: `admin${Math.random()}`,
    bio: "bio",
    url: "url",
    roleId: database_1.defaultRoles.ADMIN,
    email: `${Math.random()}admin@bloggy.com`,
    password: "$2b$10$yMyEEGz4P6ScAzlJHCh6yeiHhliD9UGeAIn9/D4BGaKU4jguFnGpS",
});
exports.adminPayload = adminPayload;
const userPayload = () => ({
    username: `John${Math.random()}`,
    bio: "John's bio",
    url: "https://web.com",
    roleId: database_1.defaultRoles.MEMBER,
    email: `${Math.random()}john@bloggy.com`,
    password: "$2b$10$yMyEEGz4P6ScAzlJHCh6yeiHhliD9UGeAIn9/D4BGaKU4jguFnGpS",
});
exports.userPayload = userPayload;
