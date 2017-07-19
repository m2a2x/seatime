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
var common_1 = require("@angular/common");
var moment = require("moment");
var data_service_1 = require("../services/data.service");
var api_service_1 = require("../services/api.service");
var SpotDetailComponent = (function () {
    function SpotDetailComponent(dataService, apiService, location, ref) {
        this.dataService = dataService;
        this.apiService = apiService;
        this.location = location;
        this.ref = ref;
    }
    SpotDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.reload({ fields: 'spots', spots: [this.spotId].join('') })
            .then(function (response) {
            _this.spot = response.spots[0];
            return _this.apiService.getSpotConditions([_this.spotId]);
        })
            .then(function (response) {
            _this.swellData = response.forecast[0];
            _this.conditionData = response.condition[0];
        });
        /* this.spot = this.apiService.get(+params['id']);
         this.spotId = +params['id'];


         this.apiService.getSpotConditions(this.spotId).then(response => {
         this.swellData = response.forecast;
         this.conditionData = response.conditions as Condition[];
         }); */
    };
    SpotDetailComponent.prototype.getDate = function (date) {
        return moment(date * 1000).format('DD MMM, hh:mm');
    };
    SpotDetailComponent.prototype.goBack = function () {
        this.location.back();
    };
    return SpotDetailComponent;
}());
__decorate([
    core_1.Input('spot-id'),
    __metadata("design:type", Number)
], SpotDetailComponent.prototype, "spotId", void 0);
SpotDetailComponent = __decorate([
    core_1.Component({
        selector: 'spot-detail',
        templateUrl: './spot-detail.component.html',
        styleUrls: ['./spot-detail.component.css']
    }),
    __metadata("design:paramtypes", [data_service_1.DataService,
        api_service_1.APIService,
        common_1.Location,
        core_1.ChangeDetectorRef])
], SpotDetailComponent);
exports.SpotDetailComponent = SpotDetailComponent;
//# sourceMappingURL=spot-detail.component.js.map