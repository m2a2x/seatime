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
var http_1 = require("@angular/http"); // {Headers}
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/map");
var SpotService = (function () {
    function SpotService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.spotesUrl = 'api/spots'; // URL to web api
    }
    SpotService.prototype.getSpots = function () {
        return this.http.get(this.spotesUrl)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(this.handleError);
    };
    SpotService.prototype.getSpot = function (id) {
        var url = this.spotesUrl + "/" + id;
        return this.http.get(url)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(this.handleError);
    };
    SpotService.prototype.delete = function (id) {
        var url = this.spotesUrl + "/" + id;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(function () { return null; })
            .catch(this.handleError);
    };
    SpotService.prototype.create = function (name) {
        return this.http
            .post(this.spotesUrl, JSON.stringify({ name: name }), { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json().data; })
            .catch(this.handleError);
    };
    SpotService.prototype.update = function (spot) {
        var url = this.spotesUrl + "/" + spot.id;
        return this.http
            .put(url, JSON.stringify(spot), { headers: this.headers })
            .toPromise()
            .then(function () { return spot; })
            .catch(this.handleError);
    };
    SpotService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    return SpotService;
}());
SpotService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], SpotService);
exports.SpotService = SpotService;
//# sourceMappingURL=spot.service.js.map