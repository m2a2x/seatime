"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var smartinput_dropdown_directive_1 = require("./smartinput.dropdown.directive");
var smartinput_state_1 = require("./smartinput.state");
var smartinput_component_1 = require("./smartinput.component");
var platform_browser_1 = require("@angular/platform-browser");
var smartinput_pipe_1 = require("./smartinput.pipe");
var forms_1 = require("@angular/forms");
var SmartinputModule = SmartinputModule_1 = (function () {
    function SmartinputModule() {
    }
    SmartinputModule.forRoot = function () {
        return {
            ngModule: SmartinputModule_1,
            providers: [
                smartinput_state_1.SmartinputState
            ]
        };
    };
    ;
    return SmartinputModule;
}());
SmartinputModule = SmartinputModule_1 = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule
        ],
        declarations: [
            smartinput_component_1.SmartinputComponent,
            smartinput_dropdown_directive_1.SmartinputDropdownDirective,
            smartinput_pipe_1.FilterPipe
        ],
        exports: [
            smartinput_component_1.SmartinputComponent
        ],
        entryComponents: [smartinput_component_1.SmartinputComponent]
    })
], SmartinputModule);
exports.SmartinputModule = SmartinputModule;
var SmartinputModule_1;
//# sourceMappingURL=smartinput.module.js.map