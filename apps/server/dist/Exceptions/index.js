"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export_star(require("./Http.exception"), exports);
_export_star(require("./BadRequest.exception"), exports);
_export_star(require("./Unauthorized.exception"), exports);
_export_star(require("./NotFound.exception"), exports);
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
