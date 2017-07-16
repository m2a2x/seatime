import {
    ComponentFactoryResolver,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewContainerRef
} from '@angular/core';
import {SmartinputState} from "./smartinput.state";
import {Subscription} from "rxjs";

@Directive({
    selector: '[smartinputdropdown]',
    host: {
        '[class.show]': 'isOpen'
    }
})
export class SmartinputDropdownDirective implements OnInit, OnDestroy {
    /**
     * Indicates that dropdown will be closed on item or document click,
     * and after pressing ESC
     */
    @Input() set autoClose(value: boolean) {
        if (typeof value === 'boolean') {
            this._state.autoClose = value;
        }
    };

    get autoClose(): boolean {
        return this._state.autoClose;
    }


    set isOpen(value: boolean) {
        if (value) {
            this.show();
        } else {
            this.hide();
        }
    }

    @Input() get isOpen(): boolean {
        return this.isShown;
    }

    /**
     * Emits an event when isOpen change
     */
    @Output() isOpenChange: EventEmitter<any>;


    private _subscriptions: Subscription[] = [];
    private _isInited = false;
    private isShown = false;

    constructor(private _elementRef: ElementRef,
                private _state: SmartinputState) {}

    ngOnInit(): void {
        if (this._isInited) {
            return;
        }
        this._isInited = true;
        this.isOpenChange = this._state.isOpenChange;
        this._state.autoClose = true;

        this._subscriptions.push(this._state
            .openMenu.subscribe(() => this.toggle(true)));

        this._subscriptions.push(this._state
            .closeMenu.subscribe(() => this.toggle(false)));
    }

    /**
     * Opens an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    show(): void {
        if (this.isOpen) {
            return;
        }
    }

    /**
     * Closes an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    hide(): void {
        if (!this.isOpen) {
            return;
        }
        this._state.isOpenChange.emit(false);
    }


    toggle(value?: boolean): void {
        this.isShown = value;
    }

    ngOnDestroy(): void {
        // clean up subscriptions and destroy dropdown
        for (const sub of this._subscriptions) {
            sub.unsubscribe();
        }
    }
}