"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SerializationHelper = (function () {
    function SerializationHelper() {
    }
    SerializationHelper.toInstance = function (obj, jsonObj) {
        if (typeof obj["fromJSON"] === "function") {
            obj["fromJSON"](jsonObj);
        }
        else {
            for (var propName in jsonObj) {
                obj[propName] = jsonObj[propName];
            }
        }
        return obj;
    };
    return SerializationHelper;
}());
exports.SerializationHelper = SerializationHelper;
//# sourceMappingURL=serialization.helper.js.map