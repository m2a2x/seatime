import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class SmartinputState {
    direction: 'down' | 'up' = 'down';
    autoClose: boolean;
    isOpenChange = new EventEmitter<boolean>();
    isDisabledChange = new EventEmitter<boolean>();
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