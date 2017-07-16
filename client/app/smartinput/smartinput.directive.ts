import {Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy} from '@angular/core';
import {SmartinputState} from "./smartinput.state";
import {Subscription} from "rxjs";

@Directive({
    selector: '[smartinput]',
    providers: [SmartinputState]
})
export class SmartinputDirective implements OnDestroy {
    @HostBinding('attr.aria-expanded') isOpen: boolean;

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: any): void {
        if (this._state.autoClose && event.button !== 2 && !this._element.nativeElement.contains(event.target)) {
            this._state.closeMenu.emit();
        }
    }

    private _subscriptions: Subscription[] = [];

    constructor(private _element: ElementRef, private _state: SmartinputState) {
        // sync is open value with state
        this._subscriptions.push(this._state
            .isOpenChange.subscribe((value: boolean) => this.isOpen = value)
        );
    }

    ngOnDestroy(): void {
        for (const sub of this._subscriptions) {
            sub.unsubscribe();
        }
    }
}