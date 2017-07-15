import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import {SmartinputState} from "./smartinput.state";

@Directive({
    selector: '[smartinputMenu]',
    exportAs: 'smart-dropdown-menu'
})
export class SmartinputMenuDirective {
    constructor(_state: SmartinputState,
                _viewContainer: ViewContainerRef,
                _templateRef: TemplateRef<any>) {

        _state.resolveDropdownMenu({
            templateRef: _templateRef,
            viewContainer: _viewContainer
        });
    }
}