import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
import {APIService} from "../services/api.service";
import {Spot} from "../models/spot";

@Component({
    selector: 'dashboard-card',
    templateUrl: './dashboard-card.component.html'
})
export class DashboardCardComponent {
    @Input('spot') spot: Spot;
    @Output() deleteSpot: EventEmitter<number> = new EventEmitter<number>();
    constructor(
        private apiService: APIService,
        private router: Router) {}

    public onSelect(): void {
        this.router.navigate(['/spots', this.spot._id]);
    }

    public delete(): void {
        this.apiService.removeFavouriteSpot(this.spot._id)
            .then(() => {
                this.deleteSpot.emit(this.spot._id);
            });
    }
}
