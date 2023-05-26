"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export_star(require("./change-password.request"), exports);
_export_star(require("./forgot-password.request"), exports);
_export_star(require("./login.request"), exports);
_export_star(require("./register.request"), exports);
_export_star(require("./update-profile.request"), exports);
_export_star(require("./reset-password.request"), exports);
_export_star(require("./store-role.request"), exports);
_export_star(require("./update-role.request"), exports);
_export_star(require("./destroy-role.request"), exports);
_export_star(require("./index-user.request"), exports);
_export_star(require("./show-user.request"), exports);
_export_star(require("./store-user.request"), exports);
_export_star(require("./update-user.request"), exports);
_export_star(require("./destroy-user.request"), exports);
_export_star(require("./destroy-tag.request"), exports);
_export_star(require("./store-tag.request"), exports);
_export_star(require("./update-tag.request"), exports);
_export_star(require("./store-post.request"), exports);
_export_star(require("./update-post.request"), exports);
_export_star(require("./destroy-post.request"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
