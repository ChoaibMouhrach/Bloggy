"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "userRouter", {
    enumerable: true,
    get: function() {
        return userRouter;
    }
});
const _Controllers = require("../Controllers");
const _Middlewares = require("../Middlewares");
const _Requests = require("../Requests");
const _express = require("express");
const userRouter = (0, _express.Router)();
userRouter.get("/", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.indexUserRequest)
], _Controllers.userController.index);
userRouter.get("/:id", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.showUserRequest)
], _Controllers.userController.show);
userRouter.post("/", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.storeUserRequest)
], _Controllers.userController.store);
userRouter.patch("/:id", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.updateUserRequest)
], _Controllers.userController.update);
userRouter.delete("/:id", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.destroyUserRequest)
], _Controllers.userController.destroy);
