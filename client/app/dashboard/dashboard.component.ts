import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {Router} from '@angular/router';
import {DataService, Spot} from '../services/data.service';
import {APIService, Reload} from "../services/api.service";

@Component({
    selector: 'my-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
    public spots: Spot[];
    public selectedSpot: Spot;
    public pair: string = '';

    constructor(private dataService: DataService,
                private apiService: APIService,
                private router: Router) {
    }

    public ngOnInit(): void {
        this.dataService.reload({fields: 'favourite'})
            .then((response: Reload) => {
                let data: Reload = response as Reload;
                this.spots = data.spots;
                if (!this.spots || !this.spots.length) {
                    return;
                }

                return this.apiService.getSpotConditions(_.map(this.spots, '_id'));
            })
            .then((response) => {
                console.log(response);
            });
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

    public deleteSpot(id: number): void {
        _.remove(this.spots, (spot: Spot) => {
            return spot._id === id;
        });
    }
}
