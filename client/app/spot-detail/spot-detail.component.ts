import {Component, Input} from '@angular/core';
import {APIService} from "../services/api.service";
import {MapProvider} from "../services/map.provider";
import {Environment, Spot} from "../models/spot";


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
        this.apiService.getSpotConditions([spot._id]).then((data: Environment) => {
            spot.setEnvironment(data[spot._id]);
        });
    }

    constructor(private mapProvider: MapProvider,
                private apiService: APIService) {
    }
}
