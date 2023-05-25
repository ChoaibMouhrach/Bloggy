"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _app = /*#__PURE__*/ _interop_require_default(require("./app"));
const _config = /*#__PURE__*/ _interop_require_default(require("./lib/config"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// new express instance
const app = (0, _app.default)();
// start the server
app.listen(_config.default.PORT, ()=>{
    console.log(`The server is running on port ${_config.default.PORT}`);
});
