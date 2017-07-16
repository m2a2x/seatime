import 'rxjs/add/operator/switchMap';
import {Component, OnInit}      from '@angular/core';
import {ActivatedRoute}         from '@angular/router';
import {Location}               from '@angular/common';
import * as moment                from 'moment';
import {DataService, Spot} from "../services/data.service";
import {APIService} from "../services/api.service";


type Condition = {
    tide: TideDataServer;
};

type TideDataServer = {
    shift: number;
    state: string;
    timestamp: number;
}

type Reload = {
    spots: Spot[];
};

@Component({
    selector: 'spot-detail',
    templateUrl: './spot-detail.component.html',
    styleUrls: ['./spot-detail.component.css']
})

export class SpotDetailComponent implements OnInit {
    public spot: Spot;
    public swellData: any[];
    public conditionData: Condition[];
    public spotId: number;

    constructor(private dataService: DataService,
                private apiService: APIService,
                private route: ActivatedRoute,
                private location: Location) {
    }

    public ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.dataService.reload({fields: 'spots', spots: [+params['id']].join('')})
                .then((response: Reload) => {
                    this.spot = response.spots[0];
                    return this.apiService.getSpotConditions([+params['id']]);
                })
                .then((response) => {
                    this.swellData = response.forecast[0];
                    this.conditionData = response.condition[0] as Condition[];
                });
                /* this.spot = this.apiService.get(+params['id']);
                this.spotId = +params['id'];


                this.apiService.getSpotConditions(this.spotId).then(response => {
                    this.swellData = response.forecast;
                    this.conditionData = response.conditions as Condition[];
                }); */
            }
        );
    }

    public getDate(date: number): string {
        return moment(date * 1000).format('DD MMM, hh:mm');
    }

    public goBack(): void {
        this.location.back();
    }
}
