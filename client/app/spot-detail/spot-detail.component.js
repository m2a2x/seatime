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
var api_service_1 = require("../services/api.service");
var SpotDetailComponent = (function () {
    function SpotDetailComponent(apiService, route, location) {
        this.apiService = apiService;
        this.route = route;
        this.location = location;
    }
    SpotDetailComponent.prototype.ngOnInit = function () {
        this.route.params.subscribe(function (params) {
            /* this.spot = this.apiService.get(+params['id']);
            this.spotId = +params['id'];


            this.apiService.getSpotConditions(this.spotId).then(response => {
                this.swellData = response.forecast;
                this.conditionData = response.conditions as Condition[];
            }); */
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
    __metadata("design:paramtypes", [api_service_1.APIService,
        router_1.ActivatedRoute,
        common_1.Location])
], SpotDetailComponent);
exports.SpotDetailComponent = SpotDetailComponent;
//# sourceMappingURL=spot-detail.component.js.map