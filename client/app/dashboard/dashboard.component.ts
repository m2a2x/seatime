import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

import {Condition, DataService, Environment, Forecast, Spot, Tide} from '../services/data.service';
import {APIService, Reload} from "../services/api.service";

type spotAdditionalData = {
    condition: Condition[],
    forecast: Forecast[]
};

@Component({
    selector: 'my-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
    public spots: Spot[];
    public selectedSpot: Spot;
    public pair: string = '';

    constructor(private dataService: DataService, private apiService: APIService) {}

    public ngOnInit(): void {
        this.dataService.reload({fields: 'favourite'})
            .then((response: Reload) => {
                let data: Reload = response as Reload;
                let timestamp;

                this.spots = data.spots;
                if (!this.spots || !this.spots.length) {
                    return;
                }

                //get today forecast
                timestamp = moment(new Date()).add(1,'days').startOf('day').unix();
                return this.apiService.getSpotConditions(_.map(this.spots, '_id'), timestamp);
            })
            .then((response: Environment) => {
                _.each(response, (data: spotAdditionalData, key: string): void => {
                    let spot: Spot = _.find(this.spots, {_id: _.parseInt(key)});
                    if (spot) {
                        spot.tide = data.condition && data.condition[0].tide;
                        spot.swell = data.forecast && data.forecast[0].swell;
                    }
                });
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
