import 'rxjs/add/operator/switchMap';
import {Component, Input} from '@angular/core';
import {Location} from '@angular/common';
import * as moment from 'moment';
import {Spot} from "../services/data.service";
import {APIService} from "../services/api.service";
import {MapProvider} from "../services/map.provider";


type Condition = {
    tide: TideDataServer;
};

type TideDataServer = {
    shift: number;
    state: string;
    timestamp: number;
}

@Component({
    selector: 'spot-detail',
    templateUrl: './spot-detail.component.html',
    styleUrls: ['./spot-detail.component.css']
})

export class SpotDetailComponent {


    @Input()
    set spot(spot: Spot) {
        this.mapProvider.clearMarkers();
        this.mapProvider
            .setByCoodrinate(spot.meta.lat, spot.meta.lon, 14)
            .then(() => {
                this.mapProvider.setMarker(spot.meta.lat, spot.meta.lon, spot.name);
            });

        this.apiService.getSpotConditions([spot._id]).then((response) => {
            // this.swellData = response.forecast[0];
            // this.conditionData = response.condition[0] as Condition[];
        });
    }


    public swellData: any[];
    public conditionData: Condition[];

    constructor(private mapProvider: MapProvider,
                private apiService: APIService,
                private location: Location) {
    }


    public getDate(date: number): string {
        return moment(date * 1000).format('DD MMM, hh:mm');
    }

    public goBack(): void {
        this.location.back();
    }
}
