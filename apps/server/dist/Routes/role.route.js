"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "roleRouter", {
    enumerable: true,
    get: function() {
        return roleRouter;
    }
});
const _Controllers = require("../Controllers");
const _Middlewares = require("../Middlewares");
const _Requests = require("../Requests");
const _express = require("express");
const roleRouter = (0, _express.Router)();
roleRouter.get("/", _Controllers.roleController.index);
roleRouter.post("/", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.storeRoleRequest)
], _Controllers.roleController.store);
roleRouter.patch("/:id", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.updateRoleRequest)
], _Controllers.roleController.update);
roleRouter.delete("/:id", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.destroyRoleRequest)
], _Controllers.roleController.destroy);
