import 'rxjs/add/operator/switchMap';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import * as moment from 'moment';
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
    @Input('spot-id') spotId: number;

    public spot: Spot;
    public swellData: any[];
    public conditionData: Condition[];

    constructor(private dataService: DataService,
                private apiService: APIService,
                private location: Location,
                private ref: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this.dataService.reload({fields: 'spots', spots: [this.spotId].join('')})
            .then((response: Reload) => {
                this.spot = response.spots[0];
                return this.apiService.getSpotConditions([this.spotId]);
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

    public getDate(date: number): string {
        return moment(date * 1000).format('DD MMM, hh:mm');
    }

    public goBack(): void {
        this.location.back();
    }
}
