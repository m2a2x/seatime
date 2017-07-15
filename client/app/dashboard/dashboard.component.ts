import {Component, OnInit}      from '@angular/core';
import * as _                     from 'lodash';
import {Router}                   from '@angular/router';
import {Spot}                     from '../services/data.service';
import {User, UserService}        from '../services/user.service';
import {APIService}               from "../services/api.service";

@Component({
    selector: 'my-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
    public spots: Spot[];
    public selectedSpot: Spot;
    public pair: string = '';

    constructor(private userService: UserService,
                private apiService: APIService,
                private router: Router) {
    }

    public ngOnInit(): void {
        let spots: Spot[] = []; // this.spotService.getSpots();
        let user: User = this.userService.getUser();
        this.spots = _.filter<Spot>(spots, (spot: Spot): boolean => {
            return _.includes<number>(user.preferenses.favouriteSpots, spot._id);
        });
    }


    public delete(spot: Spot): void {
        this.userService
            .removeFavourite(spot._id)
            .then(() => {
                this.spots = this.spots.filter(h => h !== spot);
                if (this.selectedSpot === spot) {
                    this.selectedSpot = null;
                }
            });
    }

    public onSelect(spot: Spot): void {
        this.selectedSpot = spot;
    }

    public gotoDetail(): void {
        this.router.navigate(['/detail', this.selectedSpot._id]);
    }

    public syncDevice(): void {
        let pair: number = _.parseInt(this.pair);
        console.log(pair);
        if (!pair) {
            return;
        }
        this.apiService.setSync(pair).then((isSuccessful: boolean) => {
            console.log(isSuccessful);
        });
    }
}
