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
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/map");
var api_service_1 = require("./api.service");
var SpotService = (function () {
    function SpotService(apiService) {
        this.apiService = apiService;
    }
    SpotService.prototype.set = function (spots, countries) {
        this.spots = spots;
        this.countries = countries;
    };
    SpotService.prototype.getSpots = function () {
        return this.spots;
    };
    SpotService.prototype.getCountries = function () {
        return this.countries;
    };
    SpotService.prototype.get = function (id) {
        return this.spots[id];
    };
    SpotService.prototype.getConditions = function (id) {
        return this.apiService.getSpotConditions(id);
    };
    return SpotService;
}());
SpotService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.APIService])
], SpotService);
exports.SpotService = SpotService;
//# sourceMappingURL=spot.service.js.map