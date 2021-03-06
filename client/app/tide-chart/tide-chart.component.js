"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment");
var _ = require("lodash");
var TideChartComponent = (function () {
    function TideChartComponent() {
    }
    Object.defineProperty(TideChartComponent.prototype, "tides", {
        set: function (tides) {
            this._tides = _.map(tides, function (tide) {
                return {
                    state: tide.state,
                    time: moment.unix(tide.timestamp).locale('en').format('hh:mm a')
                };
            });
        },
        enumerable: true,
        configurable: true
    });
    return TideChartComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [Array])
], TideChartComponent.prototype, "tides", null);
__decorate([
    core_1.Input('size'),
    __metadata("design:type", Number)
], TideChartComponent.prototype, "size", void 0);
TideChartComponent = __decorate([
    core_1.Component({
        selector: 'tide-chart',
        templateUrl: './tide-chart.component.html',
        styleUrls: ['./tide-chart.component.css']
    }),
    __metadata("design:paramtypes", [])
], TideChartComponent);
exports.TideChartComponent = TideChartComponent;
//# sourceMappingURL=tide-chart.component.js.map