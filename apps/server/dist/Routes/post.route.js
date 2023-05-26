"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "postRouter", {
    enumerable: true,
    get: function() {
        return postRouter;
    }
});
const _postcontroller = require("../Controllers/post.controller");
const _Middlewares = require("../Middlewares");
const _Requests = require("../Requests");
const _express = require("express");
const postRouter = (0, _express.Router)();
postRouter.get("/", _postcontroller.postController.index);
postRouter.get("/:id", _postcontroller.postController.show);
postRouter.post("/", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.storePostRequest)
], _postcontroller.postController.store);
postRouter.patch("/:id", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.updatePostRequest)
], _postcontroller.postController.update);
postRouter.delete("/:id", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.destroyPostRequest)
], _postcontroller.postController.destroy);
