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
const _nodemailer = /*#__PURE__*/ _interop_require_default(require("nodemailer"));
const _config = /*#__PURE__*/ _interop_require_default(require("./config"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const mail = _nodemailer.default.createTransport({
    host: _config.default.SMTP_HOST,
    port: _config.default.SMTP_PORT,
    auth: {
        user: _config.default.SMTP_USER,
        pass: _config.default.SMTP_PASS
    }
});
const _default = mail;
