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
var SmartinputDropdownDirective = (function () {
    function SmartinputDropdownDirective(_state) {
        this._state = _state;
        this._subscriptions = [];
        this._isInited = false;
        this.isShown = false;
    }
    Object.defineProperty(SmartinputDropdownDirective.prototype, "autoClose", {
        get: function () {
            return this._state.autoClose;
        },
        /**
         * Indicates that dropdown will be closed on item or document click,
         * and after pressing ESC
         */
        set: function (value) {
            if (typeof value === 'boolean') {
                this._state.autoClose = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(SmartinputDropdownDirective.prototype, "isOpen", {
        get: function () {
            return this.isShown;
        },
        set: function (value) {
            if (value) {
                this.show();
            }
            else {
                this.hide();
            }
        },
        enumerable: true,
        configurable: true
    });
    SmartinputDropdownDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (this._isInited) {
            return;
        }
        this._isInited = true;
        this.isOpenChange = this._state.isOpenChange;
        this._subscriptions.push(this._state
            .openMenu.subscribe(function () { return _this.show(); }));
        this._subscriptions.push(this._state
            .closeMenu.subscribe(function () { return _this.hide(); }));
    };
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    SmartinputDropdownDirective.prototype.show = function () {
        this.isShown = true;
        if (this.isOpen) {
            return;
        }
        this._state.isOpenChange.emit(true);
    };
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    SmartinputDropdownDirective.prototype.hide = function () {
        this.isShown = false;
        if (!this.isOpen) {
            return;
        }
        this._state.isOpenChange.emit(false);
    };
    SmartinputDropdownDirective.prototype.ngOnDestroy = function () {
        // clean up subscriptions and destroy dropdown
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
    };
    return SmartinputDropdownDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], SmartinputDropdownDirective.prototype, "autoClose", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], SmartinputDropdownDirective.prototype, "isOpen", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], SmartinputDropdownDirective.prototype, "isOpenChange", void 0);
SmartinputDropdownDirective = __decorate([
    core_1.Directive({
        selector: '[smartinput-dropdown]',
        exportAs: 'smartinputdropdown',
        host: {
            '[class.show]': 'isOpen'
        }
    }),
    __metadata("design:paramtypes", [smartinput_state_1.SmartinputState])
], SmartinputDropdownDirective);
exports.SmartinputDropdownDirective = SmartinputDropdownDirective;
//# sourceMappingURL=smartinput.dropdown.directive.js.map