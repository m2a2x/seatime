"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var dashboard_component_1 = require("./dashboard/dashboard.component");
var spots_component_1 = require("./spots/spots.component");
var spot_detail_component_1 = require("./spot-detail/spot-detail.component");
var spot_service_1 = require("./services/spot.service");
var user_service_1 = require("./services/user.service");
var navigation_component_1 = require("./navigation/navigation.component");
var auth_service_1 = require("./services/auth.service");
var auth_guard_1 = require("./guards/auth.guard");
var api_service_1 = require("./services/api.service");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            app_routing_module_1.AppRoutingModule
        ],
        declarations: [
            app_component_1.AppComponent,
            dashboard_component_1.DashboardComponent,
            spot_detail_component_1.SpotDetailComponent,
            spots_component_1.SpotsComponent,
            navigation_component_1.NavigationComponent
        ],
        providers: [
            api_service_1.APIService,
            auth_service_1.AuthenticationService,
            auth_guard_1.AuthGuard,
            spot_service_1.SpotService,
            user_service_1.UserService,
            {
                provide: core_1.APP_INITIALIZER,
                useFactory: function (userService, spotService) { return function () {
                    return Promise.all([userService.initUser(), spotService.initSpots()]);
                }; },
                deps: [user_service_1.UserService, spot_service_1.SpotService],
                multi: true
            }
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map