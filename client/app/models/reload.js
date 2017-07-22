"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spot_1 = require("./spot");
var serialization_helper_1 = require("../services/serialization.helper");
var _ = require("lodash");
var Reload = (function () {
    function Reload(jsonObj, userService) {
        this.jsonObj = jsonObj;
        this.userService = userService;
        if (jsonObj.user) {
            this.userService.set(jsonObj.user);
            delete jsonObj.user;
        }
        _.merge(this, jsonObj);
        this.spots = _.map(jsonObj.spots, function (spot) { return serialization_helper_1.SerializationHelper.toInstance(new spot_1.Spot(), spot); });
    }
    return Reload;
}());
exports.Reload = Reload;
;
//# sourceMappingURL=reload.js.map