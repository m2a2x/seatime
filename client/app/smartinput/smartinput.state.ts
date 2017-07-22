import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class SmartinputState {
    autoClose: boolean = true;
    isOpenChange = new EventEmitter<boolean>();
    openMenu = new EventEmitter<boolean>();
    closeMenu = new EventEmitter<boolean>();

    /**
     * Content to be displayed as popover.
     */
    dropdownMenu: Promise<any>;
    resolveDropdownMenu: (componentRef: any) => void;

    constructor() {
        this.dropdownMenu = new Promise((resolve) => {
            this.resolveDropdownMenu = resolve;
        });
    }
}