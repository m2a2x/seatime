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
var _ = require("lodash");
var user_service_1 = require("../services/user.service");
var map_provider_1 = require("../services/map.provider");
var api_service_1 = require("../services/api.service");
var smartinput_dropdown_directive_1 = require("../smartinput/smartinput.dropdown.directive");
var data_service_1 = require("../services/data.service");
var auth_service_1 = require("../services/auth.service");
var SpotsComponent = (function () {
    function SpotsComponent(userService, apiService, dataService, authService, mapProvider, route, router) {
        this.userService = userService;
        this.apiService = apiService;
        this.dataService = dataService;
        this.authService = authService;
        this.mapProvider = mapProvider;
        this.route = route;
        this.router = router;
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
            _this.apiService.reload({ fields: 'countries, spots, spot_count' }).then(function (response) {
                var data = response;
                _this.countries = _.sortBy(data.countries, 'name');
                _this.spots = _.map(data.spots, function (item) {
                    item.favourite = _this.userService.isFavourite(item._id);
                    return item;
                });
                if (spotId) {
                    _this.inited = true;
                    _this.setSpot(_this.findSpot(spotId));
                    _this.firstLevelId = _this.selectedSpot._country;
                    _this.items = _this.getByCountry(_this.firstLevelId);
                    _this.itemSelect(_this.selectedSpot._id, _this.selectedSpot.name);
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
    SpotsComponent.prototype.setSpot = function (spot) {
        if (spot === void 0) { spot = undefined; }
        this.selectedSpot = spot;
        this.dataService.setActiveSpot(spot);
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
        var _this = this;
        if (name === void 0) { name = ''; }
        this.inited = true;
        this.filter.name = name;
        if (id && this.firstLevelId) {
            this.gotoDetail(this.findSpot(id));
            return;
        }
        this.setSpot();
        this.router.navigate(['/spots']);
        this.firstLevelId = id;
        if (id) {
            this.mapProvider.setByName(name, 6);
            this.items = this.getByCountry(id);
            this.filter.name = '';
            setTimeout(function () {
                _this.search.nativeElement.focus();
            }, 0);
            return;
        }
        this.items = this.countries;
    };
    SpotsComponent.prototype.findSpot = function (id) {
        return _.find(this.spots, { _id: id });
    };
    SpotsComponent.prototype.onInput = function () {
        if (this.firstLevelId && !this.filter.name.length) {
            var name_1 = this.getCountry(this.firstLevelId);
            this.itemSelect(undefined);
            this.filter.name = name_1;
            this.mapProvider.reset();
        }
    };
    SpotsComponent.prototype.toggleSpot = function (spot, e) {
        e.stopPropagation();
        var isRemove = spot.favourite;
        var action = isRemove ? 'removeFavouriteSpot' : 'addFavouriteSpot';
        if (!this.authService.isLoggedIn()) {
            return;
        }
        this.apiService[action](spot._id)
            .then(function (response) {
            if (response.isSuccessful) {
                spot.favourite = isRemove ? false : true;
            }
            return;
        });
    };
    SpotsComponent.prototype.gotoDetail = function (spot) {
        this.setSpot(spot);
        this.router.navigate(['/spots', spot._id]);
        this.dropdown.hide();
    };
    SpotsComponent.prototype.clearSearch = function () {
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
    core_1.ViewChild('dropdown'),
    __metadata("design:type", smartinput_dropdown_directive_1.SmartinputDropdownDirective)
], SpotsComponent.prototype, "dropdown", void 0);
__decorate([
    core_1.ViewChild('search'),
    __metadata("design:type", core_1.ElementRef)
], SpotsComponent.prototype, "search", void 0);
SpotsComponent = __decorate([
    core_1.Component({
        selector: 'spots-section',
        templateUrl: './spots.component.html'
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        api_service_1.APIService,
        data_service_1.DataService,
        auth_service_1.AuthenticationService,
        map_provider_1.MapProvider,
        router_1.ActivatedRoute,
        router_1.Router])
], SpotsComponent);
exports.SpotsComponent = SpotsComponent;
//# sourceMappingURL=spots.component.js.map