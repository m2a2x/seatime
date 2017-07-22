import {EventEmitter, Injectable} from '@angular/core';
import {Spot} from "../models/spot";

@Injectable()
export class DataService {
    public spotUpdated = new EventEmitter<Spot | undefined>();

    constructor() {}

    public setActiveSpot(spot: Spot | undefined): void {
        this.spotUpdated.emit(spot);
    }
}