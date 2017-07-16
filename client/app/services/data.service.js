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
var api_service_1 = require("./api.service");
var user_service_1 = require("./user.service");
var DataService = (function () {
    function DataService(apiService, userService) {
        this.apiService = apiService;
        this.userService = userService;
    }
    DataService.prototype.reload = function (fields) {
        var _this = this;
        return this.apiService.reload(fields).then(function (response) {
            _this.userService.set(response.user);
            delete response.user;
            return response;
        });
    };
    return DataService;
}());
DataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.APIService, user_service_1.UserService])
], DataService);
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map