"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resetPasswordRequest", {
    enumerable: true,
    get: function() {
        return resetPasswordRequest;
    }
});
const _zod = /*#__PURE__*/ _interop_require_default(require("zod"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const parse = (request)=>{
    const schema = _zod.default.object({
        password: _zod.default.string().min(8),
        password_confirmation: _zod.default.string().min(8)
    }).refine(({ password , password_confirmation  })=>password === password_confirmation, {
        message: "Password and Password confirmation does not match."
    });
    return schema.safeParse(request.body);
};
const resetPasswordRequest = {
    parse
};
