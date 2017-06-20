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
var spot_service_1 = require("../services/spot.service");
var user_service_1 = require("../services/user.service");
var router_1 = require("@angular/router");
var _ = require("lodash");
var SpotsComponent = (function () {
    function SpotsComponent(spotService, userService, router) {
        this.spotService = spotService;
        this.userService = userService;
        this.router = router;
    }
    SpotsComponent.prototype.ngOnInit = function () {
        this.countries = _.toArray(this.spotService.getCountries());
    };
    SpotsComponent.prototype.sortByCountry = function (id) {
        this.spots = _.filter(this.spotService.getSpots(), {
            _country: id
        });
    };
    SpotsComponent.prototype.addSpot = function (spot, e) {
        e.stopPropagation();
        this.userService.addToFavourite(spot);
    };
    SpotsComponent.prototype.gotoDetail = function (id) {
        this.router.navigate(['/detail', id]);
    };
    return SpotsComponent;
}());
SpotsComponent = __decorate([
    core_1.Component({
        selector: 'my-spotes',
        templateUrl: './spots.component.html',
        styleUrls: ['./spots.component.css']
    }),
    __metadata("design:paramtypes", [spot_service_1.SpotService,
        user_service_1.UserService,
        router_1.Router])
], SpotsComponent);
exports.SpotsComponent = SpotsComponent;
//# sourceMappingURL=spots.component.js.map