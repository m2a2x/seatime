"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Spot = (function () {
    function Spot() {
        this.condition = [];
        this.forecast = [];
    }
    ;
    Spot.prototype.setEnvironment = function (data) {
        if (data.condition) {
            this.condition = data.condition;
            this.todayCondition = data.condition[0];
        }
        if (data.forecast) {
            this.forecast = data.forecast;
            this.todayForecast = data.forecast[0];
        }
    };
    return Spot;
}());
exports.Spot = Spot;
//# sourceMappingURL=spot.js.map