"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "tagRouter", {
    enumerable: true,
    get: function() {
        return tagRouter;
    }
});
const _Controllers = require("../Controllers");
const _Middlewares = require("../Middlewares");
const _Requests = require("../Requests");
const _express = require("express");
const tagRouter = (0, _express.Router)();
tagRouter.get("/", _Controllers.tagController.index);
tagRouter.post("/", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.storeTagRequest)
], _Controllers.tagController.store);
tagRouter.patch("/:id", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.updateTagRequest)
], _Controllers.tagController.update);
tagRouter.delete("/:id", [
    _Middlewares.authAccessMiddleware,
    (0, _Middlewares.validate)(_Requests.destroyTagRequest)
], _Controllers.tagController.destroy);
