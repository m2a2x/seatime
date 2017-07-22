import 'rxjs/add/operator/switchMap';
import {Component, Input} from '@angular/core';
import {Spot, Environment, Condition} from "../services/data.service";
import {APIService} from "../services/api.service";
import {MapProvider} from "../services/map.provider";


@Component({
    selector: 'spot-detail',
    templateUrl: './spot-detail.component.html',
    styleUrls: ['./spot-detail.component.css']
})

export class SpotDetailComponent {
    public activeSpot: Spot;

    @Input()
    set spot(spot: Spot) {
        this.mapProvider.clearMarkers();
        this.mapProvider
            .setByCoodrinate(spot.meta.lat, spot.meta.lon, 14)
            .then(() => {
                this.mapProvider.setMarker(spot.meta.lat, spot.meta.lon, spot.name);
            });

        this.activeSpot = spot;
        this.apiService.getSpotConditions([spot._id]).then((response: Environment) => {
            this.activeSpot.swell = response[spot._id].forecast[0].swell;
            this.activeSpot.tide = response[spot._id].condition[0].tide;
        });
    }


    public swellData: any[];
    public conditionData: Condition[];

    constructor(private mapProvider: MapProvider,
                private apiService: APIService) {
    }
}
