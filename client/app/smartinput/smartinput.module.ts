import { ModuleWithProviders, NgModule } from '@angular/core';
import {SmartinputDropdownDirective} from "./smartinput.dropdown.directive";
import {SmartinputState} from "./smartinput.state";
import {BrowserModule} from '@angular/platform-browser';
import {SmartFilterPipe} from "./smartinput.pipe";
import {FormsModule} from "@angular/forms";
import {SmartinputDirective} from "./smartinput.directive";
import {SmartinputInputDirective} from "./smartinput.input.directive";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [
        SmartinputDropdownDirective,
        SmartinputDirective,
        SmartFilterPipe,
        SmartinputInputDirective
    ],
    exports: [
        SmartinputDirective,
        SmartinputDropdownDirective,
        SmartFilterPipe,
        SmartinputInputDirective
    ]
})
export class SmartinputModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SmartinputModule,
            providers: [
                SmartinputState
            ]
        };
    };

}