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
var SmartinputDirective = (function () {
    function SmartinputDirective(_element, _state) {
        var _this = this;
        this._element = _element;
        this._state = _state;
        this._subscriptions = [];
        // sync is open value with state
        this._subscriptions.push(this._state
            .isOpenChange.subscribe(function (value) { return _this.isOpen = value; }));
    }
    /*
    @HostListener('click')
    onClick(): void {
        if (this.isDisabled) {
            return;
        }
        this._state.toggleClick.emit();
    }*/
    SmartinputDirective.prototype.onFocus = function () {
        this._state.openMenu.emit();
    };
    SmartinputDirective.prototype.onDocumentClick = function (event) {
        if (this._state.autoClose && event.button !== 2 && !this._element.nativeElement.contains(event.target)) {
            this._state.closeMenu.emit();
        }
    };
    SmartinputDirective.prototype.onEsc = function () {
        if (this._state.autoClose) {
            this._state.closeMenu.emit();
        }
    };
    SmartinputDirective.prototype.ngOnDestroy = function () {
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
    };
    return SmartinputDirective;
}());
__decorate([
    core_1.HostBinding('attr.aria-expanded'),
    __metadata("design:type", Boolean)
], SmartinputDirective.prototype, "isOpen", void 0);
__decorate([
    core_1.HostListener('focus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SmartinputDirective.prototype, "onFocus", null);
__decorate([
    core_1.HostListener('document:click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SmartinputDirective.prototype, "onDocumentClick", null);
__decorate([
    core_1.HostListener('keyup.esc'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SmartinputDirective.prototype, "onEsc", null);
SmartinputDirective = __decorate([
    core_1.Directive({
        selector: '[smartinput]'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, smartinput_state_1.SmartinputState])
], SmartinputDirective);
exports.SmartinputDirective = SmartinputDirective;
//# sourceMappingURL=smartinput.directive.js.map