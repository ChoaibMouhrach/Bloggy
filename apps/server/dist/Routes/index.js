"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _express = require("express");
const _authroute = require("./auth.route");
const _roleroute = require("./role.route");
const _userroute = require("./user.route");
const _tagroute = require("./tag.route");
const _postroute = require("./post.route");
const router = (0, _express.Router)();
// auth router
router.use("/", _authroute.authRouter);
router.use("/roles", _roleroute.roleRouter);
router.use("/users", _userroute.userRouter);
router.use("/tags", _tagroute.tagRouter);
router.use("/posts", _postroute.postRouter);
const _default = router;
