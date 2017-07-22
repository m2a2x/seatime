import {Directive, ElementRef, HostListener, OnDestroy, Renderer} from '@angular/core';
import {SmartinputState} from "./smartinput.state";
import {Subscription} from "rxjs";

@Directive({
    selector: '[smartinput-in]',
    exportAs: 'smarttext',
})
export class SmartinputInputDirective implements OnDestroy {
    @HostListener('keyup.esc')
    onEsc(): void {
        if (this._state.autoClose) {
            this._state.closeMenu.emit();
        }
    }

    @HostListener('focus')
    onFocus(): void {
        this._state.openMenu.emit();
    }

    private _subscriptions: Subscription[] = [];

    constructor(private _state: SmartinputState, private _element: ElementRef, private renderer: Renderer) {
        this._subscriptions.push(this._state
            .isOpenChange.subscribe((state: boolean) => this.openChange(state)));
    }

    private openChange(state: boolean): void {
        if (!state) {
            this.renderer.invokeElementMethod(this._element.nativeElement, 'focus', []);
        }
    }

    ngOnDestroy(): void {
        for (const sub of this._subscriptions) {
            sub.unsubscribe();
        }
    }
}