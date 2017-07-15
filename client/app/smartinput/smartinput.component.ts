import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {SmartinputState} from "./smartinput.state";
import {Spot} from "../services/data.service";
import {SmartinputDropdownDirective} from "./smartinput.dropdown.directive";


export interface DropdownComponent {
    data: any[];
}

@Component({
    selector: 'smartinputdrop',
    templateUrl: './smartinput.component.html',
})
export class SmartinputComponent implements DropdownComponent, OnInit {
    @Input() data: any[];

    public spots: Spot[] = [];
    filter: Spot = {
        _id: 0,
        _country: 0,
        name: ''
    };

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: any): void {
        if (this._state.autoClose && event.button !== 2 && !this._element.nativeElement.contains(event.target)) {
            this._state.closeMenu.emit();
        }
    }

    @HostListener('keyup.esc')
    onEsc(): void {
        if (this._state.autoClose) {
            this._state.closeMenu.emit();
        }
    }

    constructor(private _state: SmartinputState, private _element: ElementRef) {}

    public ngOnInit(): void {
        this.spots = <Spot[]> this.data;
    }

    public itemSelect(id: number): void {
        console.log(id);
        this._state.closeMenu.emit();
    }

    public addFav(id: number): void {
        console.log(id);
    }

    public onFocus() {
        this._state.openMenu.emit();
    }

    public onInput($event: any) {
        console.log($event);
    }
}