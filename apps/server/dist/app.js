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
require("express-async-errors");
const _path = require("path");
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _cors = /*#__PURE__*/ _interop_require_default(require("cors"));
const _Middlewares = require("./Middlewares/index");
const _Routes = /*#__PURE__*/ _interop_require_default(require("./Routes/index"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Creates a new express instance
 */ const makeApp = ()=>{
    const app = (0, _express.default)();
    // middlewares
    app.use((0, _cors.default)());
    app.use(_express.default.json());
    // assets
    app.use("/public", _express.default.static((0, _path.join)(__dirname, "public")));
    // routes
    app.use("/api", _Routes.default);
    // error handling
    app.use(_Middlewares.errorHandler);
    return app;
};
const _default = makeApp;
