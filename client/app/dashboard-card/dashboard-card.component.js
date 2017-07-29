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
var router_1 = require("@angular/router");
var api_service_1 = require("../services/api.service");
var spot_1 = require("../models/spot");
var DashboardCardComponent = (function () {
    function DashboardCardComponent(apiService, router) {
        this.apiService = apiService;
        this.router = router;
        this.deleteSpot = new core_1.EventEmitter();
    }
    DashboardCardComponent.prototype.onSelect = function () {
        this.router.navigate(['/spots', this.spot._id]);
    };
    DashboardCardComponent.prototype.delete = function () {
        var _this = this;
        this.apiService.removeFavouriteSpot(this.spot._id)
            .then(function () {
            _this.deleteSpot.emit(_this.spot._id);
        });
    };
    DashboardCardComponent.prototype.SetSwellPower = function () {
        var styles = { 'height': '50%' };
        return styles;
    };
    return DashboardCardComponent;
}());
__decorate([
    core_1.Input('spot'),
    __metadata("design:type", spot_1.Spot)
], DashboardCardComponent.prototype, "spot", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DashboardCardComponent.prototype, "deleteSpot", void 0);
DashboardCardComponent = __decorate([
    core_1.Component({
        selector: 'dashboard-card',
        templateUrl: './dashboard-card.component.html'
    }),
    __metadata("design:paramtypes", [api_service_1.APIService,
        router_1.Router])
], DashboardCardComponent);
exports.DashboardCardComponent = DashboardCardComponent;
//# sourceMappingURL=dashboard-card.component.js.map