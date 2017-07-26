import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import {APIService} from "../services/api.service";
import {Environment, EnvironmentData, Spot} from "../models/spot";
import {Reload} from "../models/reload";
import {Device, UserService} from "../services/user.service";


@Component({
    selector: 'my-dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    public spots: Spot[];
    public devices: Device[];
    public selectedSpot: Spot;
    public pair: string = '';

    constructor(private apiService: APIService, private userService: UserService) {}

    public ngOnInit(): void {
        this.apiService.reload({fields: 'favourite'})
            .then((response: Reload) => {
                let data: Reload = response as Reload;
                let timestamp;

                this.devices = this.userService.getDevices();
                this.spots = data.spots;
                if (!this.spots || !this.spots.length) {
                    return;
                }

                //get today forecast
                timestamp = moment(new Date()).add(1,'days').startOf('day').unix();
                return this.apiService.getSpotConditions(_.map(this.spots, '_id'), timestamp);
            })
            .then((response: Environment) => {
                _.each(response, (data: EnvironmentData, key: string): void => {
                    let spot: Spot = _.find(this.spots, {_id: _.parseInt(key)});
                    if (spot) {
                        spot.setEnvironment(data);
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
