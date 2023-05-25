"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export_star(require("./validate.middleware"), exports);
_export_star(require("./auth-access.middleware"), exports);
_export_star(require("./auth-refresh.middleware"), exports);
_export_star(require("./error-handler.middleware"), exports);
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
