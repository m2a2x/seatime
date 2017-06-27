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
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var moment = require("moment");
var spot_service_1 = require("../services/spot.service");
var SpotDetailComponent = (function () {
    function SpotDetailComponent(spotService, route, location) {
        this.spotService = spotService;
        this.route = route;
        this.location = location;
    }
    SpotDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.spot = _this.spotService.get(+params['id']);
            _this.spotId = +params['id'];
            _this.spotService.getConditions(_this.spotId).then(function (response) {
                _this.swellData = response.forecast;
                _this.conditionData = response.conditions;
            });
        });
    };
    SpotDetailComponent.prototype.getDate = function (date) {
        return moment(date * 1000).format('DD MMM, hh:mm');
    };
    SpotDetailComponent.prototype.goBack = function () {
        this.location.back();
    };
    return SpotDetailComponent;
}());
SpotDetailComponent = __decorate([
    core_1.Component({
        selector: 'spot-detail',
        templateUrl: './spot-detail.component.html',
        styleUrls: ['./spot-detail.component.css']
    }),
    __metadata("design:paramtypes", [spot_service_1.SpotService,
        router_1.ActivatedRoute,
        common_1.Location])
], SpotDetailComponent);
exports.SpotDetailComponent = SpotDetailComponent;
//# sourceMappingURL=spot-detail.component.js.map