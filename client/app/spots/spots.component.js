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
var spot_service_1 = require("./../services/spot.service");
var SpotesComponent = (function () {
    function SpotesComponent(spotService, router) {
        this.spotService = spotService;
        this.router = router;
    }
    SpotesComponent.prototype.getSpots = function () {
        var _this = this;
        this.spotService
            .getSpots()
            .then(function (spotes) { return _this.spotes = spotes; });
    };
    SpotesComponent.prototype.add = function (name) {
        var _this = this;
        name = name.trim();
        if (!name) {
            return;
        }
        this.spotService.create(name)
            .then(function (spot) {
            _this.spotes.push(spot);
            _this.selectedSpot = null;
        });
    };
    SpotesComponent.prototype.delete = function (spot) {
        var _this = this;
        this.spotService
            .delete(spot.id)
            .then(function () {
            _this.spotes = _this.spotes.filter(function (h) { return h !== spot; });
            if (_this.selectedSpot === spot) {
                _this.selectedSpot = null;
            }
        });
    };
    SpotesComponent.prototype.ngOnInit = function () {
        this.getSpots();
    };
    SpotesComponent.prototype.onSelect = function (spot) {
        this.selectedSpot = spot;
    };
    SpotesComponent.prototype.gotoDetail = function () {
        this.router.navigate(['/detail', this.selectedSpot.id]);
    };
    return SpotesComponent;
}());
SpotesComponent = __decorate([
    core_1.Component({
        selector: 'my-spotes',
        templateUrl: './spots.component.html',
        styleUrls: ['./spots.component.css']
    }),
    __metadata("design:paramtypes", [spot_service_1.SpotService,
        router_1.Router])
], SpotesComponent);
exports.SpotesComponent = SpotesComponent;
//# sourceMappingURL=spots.component.js.map