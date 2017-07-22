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
var auth_service_1 = require("../services/auth.service");
var router_1 = require("@angular/router");
var data_service_1 = require("../services/data.service");
var NavigationComponent = (function () {
    function NavigationComponent(authService, router, dataService) {
        this.authService = authService;
        this.router = router;
        this.dataService = dataService;
        this._subscriptions = [];
    }
    NavigationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.router.events
            .filter(function (event) { return event instanceof router_1.NavigationEnd; })
            .subscribe(function (event) {
            var path = event.url.split('/');
            for (var _i = 0, _a = _this._subscriptions; _i < _a.length; _i++) {
                var sub = _a[_i];
                sub.unsubscribe();
            }
            if (path[1] === 'spots') {
                _this._subscriptions.push(_this.dataService
                    .spotUpdated.subscribe(function (value) { return _this.additionItem = value; }));
            }
            else {
                _this.additionItem = undefined;
            }
        });
    };
    return NavigationComponent;
}());
NavigationComponent = __decorate([
    core_1.Component({
        selector: 'navigation',
        templateUrl: './navigation.component.html',
        styleUrls: ['./navigation.component.css']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthenticationService,
        router_1.Router,
        data_service_1.DataService])
], NavigationComponent);
exports.NavigationComponent = NavigationComponent;
//# sourceMappingURL=navigation.component.js.map