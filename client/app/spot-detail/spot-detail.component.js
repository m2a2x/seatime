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
require("rxjs/add/operator/switchMap");
var core_1 = require("@angular/core");
var api_service_1 = require("../services/api.service");
var map_provider_1 = require("../services/map.provider");
var SpotDetailComponent = (function () {
    function SpotDetailComponent(mapProvider, apiService) {
        this.mapProvider = mapProvider;
        this.apiService = apiService;
    }
    Object.defineProperty(SpotDetailComponent.prototype, "spot", {
        set: function (spot) {
            var _this = this;
            this.mapProvider.clearMarkers();
            this.mapProvider
                .setByCoodrinate(spot.meta.lat, spot.meta.lon, 14)
                .then(function () {
                _this.mapProvider.setMarker(spot.meta.lat, spot.meta.lon, spot.name);
            });
            this.activeSpot = spot;
            this.apiService.getSpotConditions([spot._id]).then(function (response) {
                _this.activeSpot.swell = response[spot._id].forecast[0].swell;
                _this.activeSpot.tide = response[spot._id].condition[0].tide;
            });
        },
        enumerable: true,
        configurable: true
    });
    return SpotDetailComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], SpotDetailComponent.prototype, "spot", null);
SpotDetailComponent = __decorate([
    core_1.Component({
        selector: 'spot-detail',
        templateUrl: './spot-detail.component.html',
        styleUrls: ['./spot-detail.component.css']
    }),
    __metadata("design:paramtypes", [map_provider_1.MapProvider,
        api_service_1.APIService])
], SpotDetailComponent);
exports.SpotDetailComponent = SpotDetailComponent;
//# sourceMappingURL=spot-detail.component.js.map