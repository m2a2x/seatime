import { ModuleWithProviders, NgModule } from '@angular/core';
import {SmartinputDropdownDirective} from "./smartinput.dropdown.directive";
import {SmartinputState} from "./smartinput.state";
import {SmartinputComponent} from "./smartinput.component";
import {BrowserModule} from '@angular/platform-browser';
import {FilterPipe} from "./smartinput.pipe";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [
        SmartinputComponent,
        SmartinputDropdownDirective,
        FilterPipe
    ],
    exports: [
        SmartinputComponent
    ],
    entryComponents: [SmartinputComponent]
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