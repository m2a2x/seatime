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
var SmartinputInputDirective = (function () {
    function SmartinputInputDirective(_state, _element, renderer) {
        var _this = this;
        this._state = _state;
        this._element = _element;
        this.renderer = renderer;
        this._subscriptions = [];
        this._subscriptions.push(this._state
            .isOpenChange.subscribe(function (state) { return _this.openChange(state); }));
    }
    SmartinputInputDirective.prototype.onEsc = function () {
        if (this._state.autoClose) {
            this._state.closeMenu.emit();
        }
    };
    SmartinputInputDirective.prototype.onFocus = function () {
        this._state.openMenu.emit();
    };
    SmartinputInputDirective.prototype.openChange = function (state) {
        if (!state) {
            this.renderer.invokeElementMethod(this._element.nativeElement, 'focus', []);
        }
    };
    SmartinputInputDirective.prototype.ngOnDestroy = function () {
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
    };
    return SmartinputInputDirective;
}());
__decorate([
    core_1.HostListener('keyup.esc'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SmartinputInputDirective.prototype, "onEsc", null);
__decorate([
    core_1.HostListener('focus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SmartinputInputDirective.prototype, "onFocus", null);
SmartinputInputDirective = __decorate([
    core_1.Directive({
        selector: '[smartinput-in]',
        exportAs: 'smarttext',
    }),
    __metadata("design:paramtypes", [smartinput_state_1.SmartinputState, core_1.ElementRef, core_1.Renderer])
], SmartinputInputDirective);
exports.SmartinputInputDirective = SmartinputInputDirective;
//# sourceMappingURL=smartinput.input.directive.js.map