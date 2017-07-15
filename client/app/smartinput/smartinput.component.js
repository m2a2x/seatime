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
var smartinput_state_1 = require("./smartinput.state");
var SmartinputComponent = (function () {
    function SmartinputComponent(_state, _element) {
        this._state = _state;
        this._element = _element;
        this.spots = [];
        this.filter = {
            _id: 0,
            _country: 0,
            name: ''
        };
    }
    SmartinputComponent.prototype.onDocumentClick = function (event) {
        if (this._state.autoClose && event.button !== 2 && !this._element.nativeElement.contains(event.target)) {
            this._state.closeMenu.emit();
        }
    };
    SmartinputComponent.prototype.onEsc = function () {
        if (this._state.autoClose) {
            this._state.closeMenu.emit();
        }
    };
    SmartinputComponent.prototype.ngOnInit = function () {
        this.spots = this.data;
    };
    SmartinputComponent.prototype.itemSelect = function (id) {
        console.log(id);
        this._state.closeMenu.emit();
    };
    SmartinputComponent.prototype.addFav = function (id) {
        console.log(id);
    };
    SmartinputComponent.prototype.onFocus = function () {
        this._state.openMenu.emit();
    };
    SmartinputComponent.prototype.onInput = function ($event) {
        console.log($event);
    };
    return SmartinputComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], SmartinputComponent.prototype, "data", void 0);
__decorate([
    core_1.HostListener('document:click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SmartinputComponent.prototype, "onDocumentClick", null);
__decorate([
    core_1.HostListener('keyup.esc'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SmartinputComponent.prototype, "onEsc", null);
SmartinputComponent = __decorate([
    core_1.Component({
        selector: 'smartinputdrop',
        templateUrl: './smartinput.component.html',
    }),
    __metadata("design:paramtypes", [smartinput_state_1.SmartinputState, core_1.ElementRef])
], SmartinputComponent);
exports.SmartinputComponent = SmartinputComponent;
//# sourceMappingURL=smartinput.component.js.map