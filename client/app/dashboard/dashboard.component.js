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
var router_1 = require("@angular/router");
var data_service_1 = require("../services/data.service");
var api_service_1 = require("../services/api.service");
var DashboardComponent = (function () {
    function DashboardComponent(dataService, apiService, router) {
        this.dataService = dataService;
        this.apiService = apiService;
        this.router = router;
        this.pair = '';
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.reload('favourite')
            .then(function (response) {
            var data = response;
            _this.spots = data.spots;
            if (!_this.spots.length) {
                return;
            }
            return _this.apiService.getSpotConditions(_.map(_this.spots, '_id'));
        })
            .then(function (response) {
            console.log(response);
        });
    };
    DashboardComponent.prototype.delete = function (spot) {
        var _this = this;
        this.apiService.removeFavouriteSpot(spot._id)
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
    DashboardComponent.prototype.syncDevice = function () {
        var pair = _.parseInt(this.pair);
        console.log(pair);
        if (!pair) {
            return;
        }
        this.apiService.setSync(pair).then(function (isSuccessful) {
            console.log(isSuccessful);
        });
    };
    return DashboardComponent;
}());
DashboardComponent = __decorate([
    core_1.Component({
        selector: 'my-dashboard',
        templateUrl: './dashboard.component.html',
        styleUrls: ['./dashboard.component.css']
    }),
    __metadata("design:paramtypes", [data_service_1.DataService,
        api_service_1.APIService,
        router_1.Router])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map