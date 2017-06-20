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
var _ = require("lodash");
var spot_service_1 = require("../services/spot.service");
var router_1 = require("@angular/router");
var user_service_1 = require("../services/user.service");
var DashboardComponent = (function () {
    function DashboardComponent(spotService, userService, router) {
        this.spotService = spotService;
        this.userService = userService;
        this.router = router;
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var spots = this.spotService.getSpots();
        var user = this.userService.getUser();
        this.spots = _.filter(spots, function (spot) {
            return _.includes(user.preferenses.favouriteSpots, spot._id);
        });
    };
    DashboardComponent.prototype.delete = function (spot) {
        var _this = this;
        this.userService
            .removeFavourite(spot._id)
            .then(function () {
            _this.spots = _this.spots.filter(function (h) { return h !== spot; });
            if (_this.selectedSpot === spot) {
                _this.selectedSpot = null;
            }
        });
    };
    DashboardComponent.prototype.onSelect = function (spot) {
        this.selectedSpot = spot;
    };
    DashboardComponent.prototype.gotoDetail = function () {
        this.router.navigate(['/detail', this.selectedSpot._id]);
    };
    return DashboardComponent;
}());
DashboardComponent = __decorate([
    core_1.Component({
        selector: 'my-dashboard',
        templateUrl: './dashboard.component.html',
        styleUrls: ['./dashboard.component.css']
    }),
    __metadata("design:paramtypes", [spot_service_1.SpotService,
        user_service_1.UserService,
        router_1.Router])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map