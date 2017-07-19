import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class SpotDetailState {
    openDetail = new EventEmitter<boolean>();
    constructor() {}
}