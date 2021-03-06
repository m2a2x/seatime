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
var http_1 = require("@angular/http");
var _ = require("lodash");
var reload_1 = require("../models/reload");
var user_service_1 = require("./user.service");
var APIService = (function () {
    function APIService(http, userService) {
        this.http = http;
        this.userService = userService;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
    }
    APIService.prototype.addFavouriteSpot = function (id) {
        var url = 'api/user/spots';
        return this.http
            .post(url + "/" + id, null, { headers: this.headers })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    APIService.prototype.removeFavouriteSpot = function (id) {
        var url = 'api/user/spots';
        return this.http
            .delete(url + "/" + id, { headers: this.headers })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    APIService.prototype.getSpotConditions = function (ids, time) {
        var url = 'api/spots/getConditions';
        var requestOptions = new http_1.RequestOptions();
        var params = new http_1.URLSearchParams();
        params.set('spots', ids.join(','));
        if (time) {
            params.set('end', time.toString());
        }
        requestOptions.params = params;
        return this.http.get(url, {
            search: params
        })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    APIService.prototype.reload = function (fields) {
        var _this = this;
        var url = 'api/reload';
        var requestOptions = new http_1.RequestOptions();
        var params = new http_1.URLSearchParams();
        _.each(fields, function (k, i) {
            params.set(i, k);
        });
        requestOptions.params = params;
        return this.http.get(url, {
            search: params
        })
            .toPromise()
            .then(function (response) {
            return new reload_1.Reload(response.json(), _this.userService);
        })
            .catch(this.handleError);
    };
    APIService.prototype.setSync = function (pair) {
        var url = 'api/sync';
        return this.http.post(url, {
            pair: pair
        }, {
            headers: this.headers
        })
            .toPromise()
            .then(function (response) {
            return response.json().isSuccesful;
        })
            .catch(this.handleError);
    };
    APIService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    return APIService;
}());
APIService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, user_service_1.UserService])
], APIService);
exports.APIService = APIService;
//# sourceMappingURL=api.service.js.map