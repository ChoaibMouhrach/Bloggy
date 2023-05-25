"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, // export config data
"default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _zod = /*#__PURE__*/ _interop_require_default(require("zod"));
const _dotenv = require("dotenv");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// env config
(0, _dotenv.config)();
// zod
const numeric = ()=>_zod.default.string().min(1).regex(/\d+/gi).transform((v)=>Number(v));
// Schema
const configSchema = _zod.default.object({
    // APP
    APP_NAME: _zod.default.string().min(1),
    // SERVER
    PORT: numeric(),
    // CLIENT
    CLIENT_URL: _zod.default.string().url(),
    // JWT
    SECRET_ACCESS: _zod.default.string().min(1),
    SECRET_REFRESH: _zod.default.string().min(1),
    SECRET_FORGOT_PASSWORD: _zod.default.string().min(1),
    SECRET_CONFIRM_EMAIL: _zod.default.string().min(1),
    // JWT DURATIONS
    DURATION_ACCESS: _zod.default.string().min(2),
    DURATION_FORGOT_PASSWORD: _zod.default.string().min(2),
    DURATION_CONFIRM_EMAIL: _zod.default.string().min(2),
    // SALT
    SALT: numeric(),
    // SMTP
    SMTP_HOST: _zod.default.string().min(1),
    SMTP_PORT: numeric(),
    SMTP_USER: _zod.default.string().min(1),
    SMTP_PASS: _zod.default.string().min(1),
    SMTP_FROM_NAME: _zod.default.string().min(1),
    SMTP_FROM_ADDRESS: _zod.default.string().email(),
    // DATABASE
    DATABASE_URL: _zod.default.string().min(1)
});
// parse config
const config = configSchema.safeParse(process.env);
if (!config.success) {
    // throw the error message
    throw Error(config.error.message);
}
const _default = config.data;
