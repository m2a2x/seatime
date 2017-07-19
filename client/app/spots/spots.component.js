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
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var _ = require("lodash");
var user_service_1 = require("../services/user.service");
var map_provider_1 = require("../services/map.provider");
var data_service_1 = require("../services/data.service");
var api_service_1 = require("../services/api.service");
var spot_detail_component_1 = require("../spot-detail/spot-detail.component");
var SpotsComponent = (function () {
    function SpotsComponent(userService, dataService, apiService, mapProvider, location, route) {
        this.userService = userService;
        this.dataService = dataService;
        this.apiService = apiService;
        this.mapProvider = mapProvider;
        this.location = location;
        this.route = route;
        this.spots = [];
        this.countries = [];
        this.filter = {
            name: ''
        };
    }
    SpotsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            var spotId = +params['id'];
            _this.dataService.reload({ fields: 'countries, spots, spot_count' }).then(function (response) {
                var data = response;
                _this.countries = _.sortBy(data.countries, 'name');
                _this.spots = _.map(data.spots, function (item) {
                    item.favourite = _this.userService.isFavourite(item._id);
                    return item;
                });
                if (spotId) {
                    _this.inited = true;
                    _this.selectedSpot = _this.findSpot(spotId);
                    _this.firstLevelId = _this.selectedSpot._country;
                    _this.items = _this.getByCountry(_this.firstLevelId);
                    _this.itemSelect(spotId);
                }
                else {
                    _this.items = _this.countries;
                }
                _this.spot_count = data.spot_count;
            });
            _this.mapProvider.set(_this.map.nativeElement);
        });
    };
    SpotsComponent.prototype.getByCountry = function (id) {
        return _.filter(this.spots, {
            _country: id
        });
    };
    SpotsComponent.prototype.getCountry = function (id) {
        var country;
        country = _.find(this.countries, { _id: id });
        if (country) {
            return country.name;
        }
        return '';
    };
    SpotsComponent.prototype.itemSelect = function (id, name) {
        this.inited = true;
        if (id && this.firstLevelId) {
            this.gotoDetail(this.findSpot(id));
            return;
        }
        this.selectedSpot = undefined;
        this.location.go('/spots');
        this.firstLevelId = id;
        if (id) {
            this.mapProvider.setByName(name, 6);
            this.items = this.getByCountry(id);
            return;
        }
        this.items = this.countries;
    };
    SpotsComponent.prototype.findSpot = function (id) {
        return _.find(this.spots, { _id: id });
    };
    SpotsComponent.prototype.toggleSpot = function (spot, e) {
        e.stopPropagation();
        var isRemove = spot.favourite;
        var action = isRemove ? 'removeFavouriteSpot' : 'addFavouriteSpot';
        this.apiService[action](spot._id)
            .then(function (response) {
            if (response.isSuccessful) {
                spot.favourite = isRemove ? false : true;
            }
            return;
        });
    };
    SpotsComponent.prototype.gotoDetail = function (spot) {
        this.selectedSpot = spot;
        this.location.go('/spots/' + spot._id);
    };
    SpotsComponent.prototype.clearFirstLevel = function () {
        this.itemSelect(undefined);
        this.mapProvider.reset();
    };
    return SpotsComponent;
}());
__decorate([
    core_1.ViewChild('bgmap'),
    __metadata("design:type", core_1.ElementRef)
], SpotsComponent.prototype, "map", void 0);
__decorate([
    core_1.ViewChild('detail'),
    __metadata("design:type", spot_detail_component_1.SpotDetailComponent)
], SpotsComponent.prototype, "detail", void 0);
SpotsComponent = __decorate([
    core_1.Component({
        selector: 'places-section',
        templateUrl: './spots.component.html',
        styleUrls: ['./spots.component.css']
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        data_service_1.DataService,
        api_service_1.APIService,
        map_provider_1.MapProvider,
        common_1.Location,
        router_1.ActivatedRoute])
], SpotsComponent);
exports.SpotsComponent = SpotsComponent;
//# sourceMappingURL=spots.component.js.map